using ProdajaLekovaBackend.Models;
using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.ProizvodDTOs
{
    public class ProizvodCreateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti naziv proizvoda.")]
        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string NazivProizvoda { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti proizvodjaca.")]
        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string Proizvodjac { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti tip proizvoda.")]
        public int TipProizvodaId { get; set; }

    }
}
