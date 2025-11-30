using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.ProizvodDTOs
{
    public class ProizvodCreateDto
    {
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
