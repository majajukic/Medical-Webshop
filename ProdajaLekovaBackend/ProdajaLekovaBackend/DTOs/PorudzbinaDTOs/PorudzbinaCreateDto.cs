﻿using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.PorudzbinaDTOs
{
    public class PorudzbinaCreateDto
    {
        public string BrojPorudzbine { get; set; } = null!;
        public DateTime DatumKreiranja { get; set; }
        public decimal? UkupanIznos { get; set; }
        public bool PlacenaPorudzbina { get; set; }
        public DateTime? DatumPlacanja { get; set; }
        public string? UplataId { get; set; }
        public int? KorisnikId { get; set; }
    }
}
