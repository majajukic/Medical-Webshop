using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs
{
    public class ApotekaProizvodCreateDto : IValidatableObject
    {
        [Required(ErrorMessage = "Obavezno je uneti id proizvoda.")]
        [JsonRequired]
        public int ProizvodId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti id apoteke.")]
        [JsonRequired]
        public int ApotekaId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti stanje zaliha.")]
        [JsonRequired]
        public int StanjeZaliha { get; set; }
        public string? Slika { get; set; }
        public decimal? PopustUprocentima { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti cenu proizvoda.")]
        [JsonRequired]
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
