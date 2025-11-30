using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.PorudzbinaDTOs
{
    public class PorudzbinaCreateDto
    {
        [JsonRequired]
        public string BrojPorudzbine { get; set; }
        [JsonRequired]
        public DateTime DatumKreiranja { get; set; }
        public decimal? UkupanIznos { get; set; }
        [JsonRequired]
        public bool PlacenaPorudzbina { get; set; }
        public DateTime? DatumPlacanja { get; set; }
        public string? UplataId { get; set; }
        public int? KorisnikId { get; set; }
    }
}
