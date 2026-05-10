using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs
{
    public class StavkaCreateDto : IValidatableObject
    {
        public int Kolicina { get; set; }
        public decimal Cena { get; set; }
        public decimal? Popust { get; set; }
        public int PorudzbinaId { get; set; }
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
