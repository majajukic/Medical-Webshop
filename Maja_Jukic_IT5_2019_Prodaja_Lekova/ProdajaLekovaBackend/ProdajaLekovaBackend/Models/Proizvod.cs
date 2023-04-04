using System;
using System.Collections.Generic;

namespace ProdajaLekovaBackend.Models
{
    public partial class Proizvod
    {
        public Proizvod()
        {
            ApotekaProizvod = new HashSet<ApotekaProizvod>();
        }

        public int ProizvodId { get; set; }
        public string NazivProizvoda { get; set; } = null!;
        public string Proizvodjac { get; set; } = null!;
        public int TipProizvodaId { get; set; }

        public virtual TipProizvoda TipProizvoda { get; set; } = null!;
        public virtual ICollection<ApotekaProizvod> ApotekaProizvod { get; set; }
    }
}
