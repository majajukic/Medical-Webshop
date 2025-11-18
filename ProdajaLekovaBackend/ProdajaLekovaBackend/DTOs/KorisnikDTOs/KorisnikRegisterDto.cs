using Newtonsoft.Json;
using ProdajaLekovaBackend.Models;
using System.ComponentModel.DataAnnotations;
using ProdajaLekovaBackend.Constants;
using ProdajaLekovaBackend.Validators;

namespace ProdajaLekovaBackend.DTOs.KorisnikDTOs
{
    public class KorisnikRegisterDto : IValidatableObject
    {
        [StringLength(ApplicationConstants.Validation.MaxImeLength, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string? Ime { get; set; }

        [StringLength(ApplicationConstants.Validation.MaxPrezimeLength, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string? Prezime { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti email.")]
        [StringLength(ApplicationConstants.Validation.MaxEmailLength, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
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

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!EmailValidator.IsValid(Email))
            {
                yield return new ValidationResult(
                    EmailValidator.GetErrorMessage(),
                    new[] { nameof(Email) });
            }

            if (!PasswordValidator.IsValid(Lozinka))
            {
                yield return new ValidationResult(
                    PasswordValidator.GetErrorMessage(),
                    new[] { nameof(Lozinka) });
            }
        }
    }
}
