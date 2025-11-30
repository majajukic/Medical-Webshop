using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.TipProizvodaDTOs
{
    public class TipProizvodaCreateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti naziv ulice.")]
        [JsonRequired]
        [StringLength(20, ErrorMessage = "Maximum 20 karaktera prekoračeno")]
        public string NazivTipaProizvoda { get; set; } = null!;
    }
}
