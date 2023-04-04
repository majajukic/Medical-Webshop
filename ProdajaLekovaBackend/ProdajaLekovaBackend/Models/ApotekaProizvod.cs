using System;
using System.Collections.Generic;

namespace ProdajaLekovaBackend.Models
{
    public partial class ApotekaProizvod
    {
        public ApotekaProizvod()
        {
            StavkaPorudzbine = new HashSet<StavkaPorudzbine>();
        }

        public int ApotekaProizvodId { get; set; }
        public int ProizvodId { get; set; }
        public int ApotekaId { get; set; }
        public int StanjeZaliha { get; set; }
        public string? Slika { get; set; }
        public decimal? PopustUprocentima { get; set; }
        public decimal CenaBezPopusta { get; set; }
        public decimal? CenaSaPopustom { get; set; }

        public virtual Apoteka Apoteka { get; set; } = null!;
        public virtual Proizvod Proizvod { get; set; } = null!;
        public virtual ICollection<StavkaPorudzbine> StavkaPorudzbine { get; set; }
    }
}
