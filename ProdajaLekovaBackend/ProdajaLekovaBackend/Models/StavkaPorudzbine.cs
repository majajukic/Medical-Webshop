using System;
using System.Collections.Generic;

namespace ProdajaLekovaBackend.Models
{
    public partial class StavkaPorudzbine
    {
        public int StavkaId { get; set; }
        public int Kolicina { get; set; }
        public decimal Cena { get; set; }
        public decimal? Popust { get; set; }
        public int PorudzbinaId { get; set; }
        public int ApotekaProizvodId { get; set; }

        public virtual ApotekaProizvod ApotekaProizvod { get; set; } = null!;
        public virtual Porudzbina Porudzbina { get; set; } = null!;
    }
}
