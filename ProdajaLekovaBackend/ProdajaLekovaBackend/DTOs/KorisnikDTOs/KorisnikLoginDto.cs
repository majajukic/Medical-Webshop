using System.ComponentModel.DataAnnotations;
using ProdajaLekovaBackend.Constants;
using ProdajaLekovaBackend.Validators;

namespace ProdajaLekovaBackend.DTOs.KorisnikDTOs
{
    public class KorisnikLoginDto : IValidatableObject
    {
        [Required(ErrorMessage = "Obavezno je uneti email.")]
        [StringLength(ApplicationConstants.Validation.MaxEmailLength,
            ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti lozinku.")]
        public string Lozinka { get; set; } = null!;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!EmailValidator.IsValid(Email))
            {
                yield return new ValidationResult(
                    EmailValidator.GetErrorMessage(),
                    new[] { nameof(Email) });
            }
        }
    }
}
