using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.KorisnikDTOs
{
    public class KorisnikLoginDto
    {

        [Required(ErrorMessage = "Obavezno je uneti email.")]
        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti lozinku.")]
        public string Lozinka { get; set; } = null!;
    }
}
