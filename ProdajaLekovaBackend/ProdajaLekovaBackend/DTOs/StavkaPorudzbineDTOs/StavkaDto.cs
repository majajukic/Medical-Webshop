using ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
using ProdajaLekovaBackend.Models;

namespace ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs
{
    public class StavkaDto
    {
        public int StavkaId { get; set; }
        public int Kolicina { get; set; }
        public decimal Cena { get; set; }
        public decimal? Popust { get; set; }

        public virtual ApotekaProizvodDto ApotekaProizvod { get; set; } = null!;
        public virtual PorudzbinaDto Porudzbina { get; set; } = null!;
    }
}
