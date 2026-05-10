using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs
{
    public class ApotekaProizvodCreateDto : IValidatableObject
    {
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
                  new[] { "ApotekaProizvodCreateDto" });
            }

            if (PopustUprocentima <= 0 || CenaBezPopusta <= 0)
            {
                yield return new ValidationResult(
                  "Popust i cena moraju biti vece od 0.",
                  new[] { "ApotekaProizvodCreateDto" });
            }
        }
    }
}
