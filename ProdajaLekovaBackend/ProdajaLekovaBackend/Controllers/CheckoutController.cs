using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.Constants;
using ProdajaLekovaBackend.DTOs.CheckoutDTO;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
using ProdajaLekovaBackend.Exceptions;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using Stripe;
using Stripe.Checkout;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/checkout")]
    [ApiController]
    public class CheckoutController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(
            IConfiguration configuration,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<CheckoutController> logger)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("checkoutSession")]
        public ActionResult CreateSession([FromBody] CheckoutDto checkoutDto)
        {
            var stripeSettings = _configuration.GetSection("Stripe");
            var frontendUrl = _configuration.GetValue<string>("FrontendUrl") ?? "http://localhost:3000";

            decimal totalAmountInEUR = checkoutDto.UkupanIznos / ApplicationConstants.Payment.RsdToRsdConversionRate;
            long totalAmountInCents = (long)(Math.Round(totalAmountInEUR, 2) * 100);

            var productOptions = new ProductCreateOptions
            {
                Name = "Ukupan iznos:",
            };

            var productService = new ProductService();
            var product = productService.Create(productOptions);

            var priceOptions = new PriceCreateOptions
            {
                Currency = ApplicationConstants.Payment.Currency,
                UnitAmount = totalAmountInCents,
                Product = product.Id,
            };

            var priceService = new PriceService();
            var price = priceService.Create(priceOptions);

            var orderId = checkoutDto.PorudzbinaId;

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>
                {
                    "card"
                },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = price.Id,
                        Quantity = 1
                    }
                },
                Mode = "payment",
                SuccessUrl = $"{frontendUrl}/placanjeUspesno",
                CancelUrl = $"{frontendUrl}/placanjeOtkazano",
                Metadata = new Dictionary<string, string>
                {
                    { "totalAmount", totalAmountInEUR.ToString() },
                    { "orderId", orderId.ToString() }
                },
                BillingAddressCollection = "required"
            };

            var service = new SessionService();
            Session session = service.Create(options);

            return Json(new { sessionId = session.Id, publishKey = stripeSettings.GetSection("PublishKey").Value });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> ChargeWebhook()
        {
            var stripeSettings = _configuration.GetSection("Stripe");

            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json,
                Request.Headers["Stripe-Signature"], stripeSettings.GetSection("WebhookKey").Value);

            if (stripeEvent.Type == Events.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;

                var orderId = session?.Metadata.GetValueOrDefault("orderId");

                if (orderId != null)
                {
                    var porudzbinaUpdateDto = new PorudzbinaUpdateDto
                    {
                        PorudzbinaId = int.Parse(orderId),
                        DatumPlacanja = DateTime.Now,
                        PlacenaPorudzbina = true,
                        UplataId = session?.Id
                    };

                    var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaUpdateDto.PorudzbinaId);

                    if (porudzbina == null)
                        throw new NotFoundException("Porudzbina", porudzbinaUpdateDto.PorudzbinaId);

                    _mapper.Map(porudzbinaUpdateDto, porudzbina);

                    _unitOfWork.Porudzbina.UpdateAsync(porudzbina);

                    await _unitOfWork.Save();
                }
                else
                {
                    _logger.LogWarning("Webhook received without order ID");
                }
            }
            else if (stripeEvent.Type == Events.PaymentIntentPaymentFailed)
            {
                _logger.LogWarning("Payment failed: {EventType}", stripeEvent.Type);
            }
            else
            {
                _logger.LogInformation("Unhandled Stripe event type: {EventType}", stripeEvent.Type);
            }

            return Ok();
        }

    }
}
