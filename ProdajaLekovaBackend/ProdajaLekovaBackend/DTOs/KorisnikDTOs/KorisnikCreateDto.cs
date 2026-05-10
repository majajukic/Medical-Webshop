using ProdajaLekovaBackend.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace ProdajaLekovaBackend.DTOs.KorisnikDTOs
{
    public class KorisnikCreateDto : IValidatableObject
    {

        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string? Ime { get; set; }

        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string? Prezime { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti email.")]
        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti lozinku.")]
        public string Lozinka { get; set; } = null!;

        [StringLength(15, ErrorMessage = "Maximum 15 karaktera prekoračeno")]
        public string? BrojTelefona { get; set; }

        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string? Ulica { get; set; }

        [StringLength(25, ErrorMessage = "Maximum 5 karaktera prekoračeno")]
        public string? Broj { get; set; }

        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string? Mesto { get; set; }

        public TipKorisnikaEnum? TipKorisnika { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!Regex.IsMatch(Email, @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                     @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-0-9a-z]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                     RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250)))
            {
                yield return new ValidationResult(
                  "Pogresan format email adrese (primer: email@gmail.com).",
                  new[] { "KorisnikCreateDTO" });
            }

            if(!Regex.IsMatch(Lozinka, @"^(?=.*[A-Za-z])(?=.*\d).+$"))
            {
                yield return new ValidationResult(
                  "Lozinka mora sadrzati i brojeve i karaktere.",
                  new[] { "KorisnikCreateDTO" });
            }

            if(Lozinka.Length < 8)
            {
                yield return new ValidationResult(
                  "Lozinka mora imati minimum 8 karaktera.",
                  new[] { "KorisnikCreateDTO" });
            }
        }
    }
}
