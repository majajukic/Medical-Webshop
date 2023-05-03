using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs
{
    public class ApotekaProizvodUpdateDto : IValidatableObject
    {
        [Required(ErrorMessage = "Obavezno je uneti id.")]
        public int ApotekaProizvodId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti id proizvoda.")]
        public int ProizvodId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti id apoteke.")]
        public int ApotekaId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti stanje zaliha.")]
        public int StanjeZaliha { get; set; }
        public string? Slika { get; set; }
        public decimal? PopustUprocentima { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti cenu proizvoda.")]
        public decimal CenaBezPopusta { get; set; }

        public decimal? CenaSaPopustom { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (StanjeZaliha <= 0)
            {
                yield return new ValidationResult(
                  "Stanje zaliha mora biti vece od 0.",
                  new[] { "ApotekaProizvodUpdateDto" });
            }

            if (PopustUprocentima <= 0 || CenaBezPopusta <= 0)
            {
                yield return new ValidationResult(
                  "Popust i cena moraju biti vece od 0.",
                  new[] { "ApotekaProizvodUpdateDto" });
            }
        }
    }
}
