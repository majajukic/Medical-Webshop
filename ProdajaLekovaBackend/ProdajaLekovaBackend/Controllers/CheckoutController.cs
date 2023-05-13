using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.CheckoutDTO;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
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

        public CheckoutController(IConfiguration configuration, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("checkoutSession")]
        public ActionResult CreateSession([FromBody] CheckoutDto checkoutDto)
        {
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

            return Json(new { sessionId = session.Id, publishKey = stripeSettings.GetSection("PublishKey").Value });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> ChargeWebhook()
        {
            var stripeSettings = _configuration.GetSection("Stripe");

            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], stripeSettings.GetSection("WebhookKey").Value);

                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;

                    var orderId = session?.Metadata.GetValueOrDefault("orderId");

                    if(orderId != null)
                    {

                        var porudzbinaUpdateDto = new PorudzbinaUpdateDto
                        {
                            PorudzbinaId = int.Parse(orderId),
                            DatumPlacanja = DateTime.Now,
                            PlacenaPorudzbina = true,
                            UplataId = session?.Id

                        };

                        var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaUpdateDto.PorudzbinaId);

                        if (porudzbina == null) return NotFound("Porudzbina nije pronadjena.");

                        _mapper.Map(porudzbinaUpdateDto, porudzbina);

                        _unitOfWork.Porudzbina.UpdateAsync(porudzbina);

                        await _unitOfWork.Save();
                    }
                    else
                    {
                        Console.WriteLine("No order ID.");
                    }

                }
                else if (stripeEvent.Type == Events.PaymentIntentPaymentFailed)
                {
                    Console.WriteLine("payment failed");
                }
                else
                {
                    Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
                }

                return Ok();
            }
            catch (StripeException e)
            {
                Console.WriteLine(e.StripeError.Message);
                return BadRequest();
            }
        }

    }
}
