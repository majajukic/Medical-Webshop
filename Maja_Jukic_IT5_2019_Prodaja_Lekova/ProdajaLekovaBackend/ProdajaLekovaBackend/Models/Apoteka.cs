using System;
using System.Collections.Generic;

namespace ProdajaLekovaBackend.Models
{
    public partial class Apoteka
    {
        public Apoteka()
        {
            ApotekaProizvod = new HashSet<ApotekaProizvod>();
        }

        public int ApotekaId { get; set; }
        public string NazivApoteke { get; set; } = null!;

        public virtual ICollection<ApotekaProizvod> ApotekaProizvod { get; set; }
    }
}
