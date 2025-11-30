using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs
{
    public class StavkaUpdateDto : IValidatableObject
    {
        [Required(ErrorMessage = "Obavezno je uneti id stavke.")]
        [JsonRequired]
        public int StavkaId { get; set; }
        [JsonRequired]
        public int Kolicina { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Kolicina <= 0)
            {
                yield return new ValidationResult(
                  "Kolicina odabranog proizvoda mora biti veca od 0.",
                  new[] { "StavkaUpdateDTO" });
            }

        }
    }
}
