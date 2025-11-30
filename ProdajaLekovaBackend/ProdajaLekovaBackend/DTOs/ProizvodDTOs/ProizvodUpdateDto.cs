using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.ProizvodDTOs
{
    public class ProizvodUpdateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti id proizvoda.")]
        [JsonRequired]
        public int ProizvodId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti naziv proizvoda.")]
        [JsonRequired]
        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string NazivProizvoda { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti proizvodjaca.")]
        [JsonRequired]
        [StringLength(35, ErrorMessage = "Maximum 35 karaktera prekoračeno")]
        public string Proizvodjac { get; set; } = null!;

        [Required(ErrorMessage = "Obavezno je uneti tip proizvoda.")]
        [JsonRequired]
        public int TipProizvodaId { get; set; }
    }
}
