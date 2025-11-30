using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.CheckoutDTO
{
    public class CheckoutDto
    {
        [Required]
        [JsonRequired]
        public decimal UkupanIznos { get; set; }

        [Required]
        [JsonRequired]
        public int PorudzbinaId { get; set; }
    }
}
