using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.KorisnikDTOs
{
    public class KorisnikLoginDto : IValidatableObject
    {

        [Required(ErrorMessage = "Obavezno je uneti email.")]
        [JsonRequired]
        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti lozinku.")]
        [JsonRequired]
        public string Lozinka { get; set; } = null!;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!Regex.IsMatch(Email, @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                                 @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-0-9a-z]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                                 RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250)))
            {
                yield return new ValidationResult(
                  "Pogresan format email adrese (primer: email@gmail.com).",
                  new[] { "KorisnikLoginDTO" });
            }
        }
    }
}
