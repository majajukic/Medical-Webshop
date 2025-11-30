using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs
{
    public class StavkaCreateDto : IValidatableObject
    {
        [JsonRequired]
        public int Kolicina { get; set; }
        [JsonRequired]
        public decimal Cena { get; set; }
        public decimal? Popust { get; set; }
        [JsonRequired]
        public int PorudzbinaId { get; set; }
        [JsonRequired]
        public int ApotekaProizvodId { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if(Kolicina <= 0)
            {
                yield return new ValidationResult(
                  "Kolicina odabranog proizvoda mora biti veca od 0.",
                  new[] { "StavkaCreateDTO" });
            }
        }
    }
}
