using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.TipProizvodaDTOs
{
    public class TipProizvodaCreateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti naziv ulice.")]
        [StringLength(20, ErrorMessage = "Maximum 20 karaktera prekoračeno")]
        public string NazivTipaProizvoda { get; set; } = null!;
    }
}
