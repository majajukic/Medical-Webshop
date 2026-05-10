using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.ApotekaDTOs
{
    public class ApotekaUpdateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti id apoteke.")]
        public int ApotekaId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti naziv ulice.")]
        [StringLength(65, ErrorMessage = "Maximum 65 karaktera prekoračeno")]
        public string NazivApoteke { get; set; } = null!;
    }
}
