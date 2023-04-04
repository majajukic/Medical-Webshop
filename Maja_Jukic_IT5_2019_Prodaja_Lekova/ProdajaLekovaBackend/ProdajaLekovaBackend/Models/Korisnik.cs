using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProdajaLekovaBackend.Models
{
    public partial class Korisnik
    {
        public Korisnik()
        {
            Porudzbina = new HashSet<Porudzbina>();
        }

        public int KorisnikId { get; set; }
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
        public string Lozinka { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? BrojTelefona { get; set; }
        public string? Ulica { get; set; }
        public string? Broj { get; set; }
        public string? Mesto { get; set; }

        public TipKorisnikaEnum TipKorisnika { get; set; } 
        public virtual ICollection<Porudzbina> Porudzbina { get; set; }
    }
}
