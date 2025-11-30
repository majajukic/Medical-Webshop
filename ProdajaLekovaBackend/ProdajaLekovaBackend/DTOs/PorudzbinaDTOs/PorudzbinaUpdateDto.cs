using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.PorudzbinaDTOs
{
    public class PorudzbinaUpdateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti id porudzbine.")]
        [JsonRequired]
        public int PorudzbinaId { get; set; }
        public DateTime? DatumPlacanja { get; set; }
        public bool? PlacenaPorudzbina { get; set; }
        public string? UplataId { get; set; }

    }
}
