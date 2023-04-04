using System;
using System.Collections.Generic;

namespace ProdajaLekovaBackend.Models
{
    public partial class Porudzbina
    {
        public Porudzbina()
        {
            StavkaPorudzbine = new HashSet<StavkaPorudzbine>();
        }

        public int PorudzbinaId { get; set; }
        public string BrojPorudzbine { get; set; } = null!;
        public DateTime DatumKreiranja { get; set; }
        public decimal? UkupanIznos { get; set; }
        public bool PlacenaPorudzbina { get; set; }
        public DateTime? DatumPlacanja { get; set; }
        public string? UplataId { get; set; }
        public int KorisnikId { get; set; }

        public virtual Korisnik Korisnik { get; set; } = null!;
        public virtual ICollection<StavkaPorudzbine> StavkaPorudzbine { get; set; }
    }
}
