using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.CheckoutDTO;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
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

        public CheckoutController(IConfiguration configuration, IUnitOfWork unitOfWork, IMapper mapper, ILogger<CheckoutController> logger)
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
            _logger.LogInformation("Creating Stripe checkout session for order: {PorudzbinaId}, Amount: {UkupanIznos}", checkoutDto.PorudzbinaId, checkoutDto.UkupanIznos);

            var stripeSettings = _configuration.GetSection("Stripe");
            decimal conversionRate = 118;

            decimal totalAmountInEUR = checkoutDto.UkupanIznos / conversionRate;
            long totalAmountInCents = (long)(Math.Round(totalAmountInEUR, 2) * 100);

            var productOptions = new ProductCreateOptions
            {
                Name = "Ukupan iznos:",
            };

            var productService = new ProductService();
            var product = productService.Create(productOptions);

            var priceOptions = new PriceCreateOptions
            {
                Currency = "eur",
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
                SuccessUrl = "http://localhost:3000/placanjeUspesno",
                CancelUrl = "http://localhost:3000/placanjeOtkazano",
                Metadata = new Dictionary<string, string>
                {
                    { "totalAmount", totalAmountInEUR.ToString() },
                    { "orderId", orderId.ToString() }
                },
                BillingAddressCollection = "required"
            };

            var service = new SessionService();
            Session session = service.Create(options);

            _logger.LogInformation("Successfully created Stripe checkout session: {SessionId} for order: {PorudzbinaId}", session.Id, orderId);
            return Json(new { sessionId = session.Id, publishKey = stripeSettings.GetSection("PublishKey").Value });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> ChargeWebhook()
        {
            _logger.LogInformation("Received Stripe webhook");

            var stripeSettings = _configuration.GetSection("Stripe");

            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json,
                Request.Headers["Stripe-Signature"], stripeSettings.GetSection("WebhookKey").Value);

            if (stripeEvent.Type == Events.CheckoutSessionCompleted)
            {
                _logger.LogInformation("Processing checkout session completed event");
                var session = stripeEvent.Data.Object as Session;

                var orderId = session?.Metadata.GetValueOrDefault("orderId");

                if (orderId != null)
                {
                    _logger.LogInformation("Updating order payment status for order: {OrderId}, Session: {SessionId}", orderId, session?.Id);

                    var porudzbinaUpdateDto = new PorudzbinaUpdateDto
                    {
                        PorudzbinaId = int.Parse(orderId),
                        DatumPlacanja = DateTime.Now,
                        PlacenaPorudzbina = true,
                        UplataId = session?.Id

                    };

                    var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaUpdateDto.PorudzbinaId);

                    if (porudzbina == null)
                    {
                        _logger.LogWarning("Order {OrderId} not found for payment update", orderId);
                        return NotFound("Porudzbina nije pronadjena.");
                    }

                    _mapper.Map(porudzbinaUpdateDto, porudzbina);

                    _unitOfWork.Porudzbina.UpdateAsync(porudzbina);

                    await _unitOfWork.Save();

                    _logger.LogInformation("Successfully updated payment status for order: {OrderId}", orderId);
                }
                else
                {
                    _logger.LogWarning("Checkout session completed but no order ID found in metadata");
                }

            }
            else if (stripeEvent.Type == Events.PaymentIntentPaymentFailed)
            {
                _logger.LogWarning("Payment failed for event type: {EventType}", stripeEvent.Type);
            }
            else
            {
                _logger.LogInformation("Unhandled Stripe event type: {EventType}", stripeEvent.Type);
            }

            return Ok();
        }

    }
}
