using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs
{
    public class StavkaUpdateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti id stavke.")]
        public int StavkaId { get; set; }
        public int Kolicina { get; set; }
    }
}
