using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.ApotekaDTOs
{
    public class ApotekaCreateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti naziv apoteke.")]
        [StringLength(65, ErrorMessage = "Maximum 65 karaktera prekoračeno")]
        public string NazivApoteke { get; set; } = null!;
    }
}
