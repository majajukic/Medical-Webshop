using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs
{
    public class StavkaUpdateDto : IValidatableObject
    {
        [Required(ErrorMessage = "Obavezno je uneti id stavke.")]
        public int StavkaId { get; set; }
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
