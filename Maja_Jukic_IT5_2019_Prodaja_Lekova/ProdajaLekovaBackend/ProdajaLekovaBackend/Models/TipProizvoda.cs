using System;
using System.Collections.Generic;

namespace ProdajaLekovaBackend.Models
{
    public partial class TipProizvoda
    {
        public TipProizvoda()
        {
            Proizvod = new HashSet<Proizvod>();
        }

        public int TipProizvodaId { get; set; }
        public string NazivTipaProizvoda { get; set; } = null!;

        public virtual ICollection<Proizvod> Proizvod { get; set; }
    }
}
