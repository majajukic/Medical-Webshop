using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.TipProizvodaDTOs
{
    public class TipProizvodaUpdateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti id tipa proizvoda.")]
        public int TipProizvodaId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti naziv ulice.")]
        [StringLength(20, ErrorMessage = "Maximum 20 karaktera prekoračeno")]
        public string NazivTipaProizvoda { get; set; } = null!;
    }
}
