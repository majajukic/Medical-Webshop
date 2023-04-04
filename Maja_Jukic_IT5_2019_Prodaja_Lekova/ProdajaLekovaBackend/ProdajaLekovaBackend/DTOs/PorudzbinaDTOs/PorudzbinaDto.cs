using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Models;

namespace ProdajaLekovaBackend.DTOs.PorudzbinaDTOs
{
    public class PorudzbinaDto
    {
        public int PorudzbinaId { get; set; }
        public string BrojPorudzbine { get; set; } = null!;
        public DateTime DatumKreiranja { get; set; }
        public decimal? UkupanIznos { get; set; }
        public bool PlacenaPorudzbina { get; set; }
        public DateTime? DatumPlacanja { get; set; }
        public string? UplataId { get; set; }

        public virtual KorisnikDto Korisnik { get; set; } = null!;
        public virtual ICollection<StavkaDto> StavkaPorudzbine { get; set; }
    }
}
