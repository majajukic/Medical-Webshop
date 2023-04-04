namespace ProdajaLekovaBackend.DTOs.PorudzbinaDTOs
{
    public class JoinedCreateDto
    {
        public string? BrojPorudzbine { get; set; }
        public DateTime? DatumKreiranja { get; set; }
        public decimal? UkupanIznos { get; set; }
        public bool? PlacenaPorudzbina { get; set; }
        public DateTime? DatumPlacanja { get; set; }
        public string? UplataId { get; set; }
        public int KorisnikId { get; set; }
        public int Kolicina { get; set; }
        public decimal Cena { get; set; }
        public decimal? Popust { get; set; }
        public int ApotekaProizvodId { get; set; }

    }
}
