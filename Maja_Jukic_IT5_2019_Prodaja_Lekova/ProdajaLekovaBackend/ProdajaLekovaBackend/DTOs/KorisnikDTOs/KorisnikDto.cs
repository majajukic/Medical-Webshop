using ProdajaLekovaBackend.Models;

namespace ProdajaLekovaBackend.DTOs.KorisnikDTOs
{
    public class KorisnikDto
    {
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

    }
}
