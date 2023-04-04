using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs
{
    public class StavkaCreateDto
    {
        public int Kolicina { get; set; }
        public decimal Cena { get; set; }
        public decimal? Popust { get; set; }
        public int PorudzbinaId { get; set; }
        public int ApotekaProizvodId { get; set; }

    }
}
