using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.CheckoutDTO;
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

        public CheckoutController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("checkoutSession")]
        public ActionResult CreateSession([FromBody] CheckoutDto checkoutDto)
        {
            var stripeSettings = _configuration.GetSection("Stripe");
            decimal conversionRate = 0.0093m;

            decimal totalAmountInUSD = checkoutDto.UkupanIznos * conversionRate;
            long totalAmountInCents = (long)(Math.Round(totalAmountInUSD, 2) * 100);

            var productOptions = new ProductCreateOptions
            {
                Name = "Ukupan iznos:",
            };

            var productService = new ProductService();
            var product = productService.Create(productOptions);

            var priceOptions = new PriceCreateOptions
            {
                Currency = "usd",
                UnitAmount = totalAmountInCents,
                Product = product.Id,
            };

            var priceService = new PriceService();
            var price = priceService.Create(priceOptions);

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
                    { "totalAmount", totalAmountInUSD.ToString() }
                },
                BillingAddressCollection = "required"
            };

            var service = new SessionService();
            Session session = service.Create(options);

            return Json(new { sessionId = session.Id, publishKey = stripeSettings.GetSection("PublishKey").Value });
        }

    }
}
