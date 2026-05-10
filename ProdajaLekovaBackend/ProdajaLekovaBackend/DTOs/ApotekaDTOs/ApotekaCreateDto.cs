using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.ApotekaDTOs
{
    public class ApotekaCreateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti naziv apoteke.")]
        [JsonRequired]
        [StringLength(65, ErrorMessage = "Maximum 65 karaktera prekoračeno")]
        public string NazivApoteke { get; set; } = null!;
    }
}
