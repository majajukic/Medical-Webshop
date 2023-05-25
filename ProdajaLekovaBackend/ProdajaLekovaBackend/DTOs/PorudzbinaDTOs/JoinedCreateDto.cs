﻿using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.PorudzbinaDTOs
{
    public class JoinedCreateDto : IValidatableObject
    {
        public string? BrojPorudzbine { get; set; }
        public DateTime? DatumKreiranja { get; set; }
        public decimal? UkupanIznos { get; set; }
        public bool? PlacenaPorudzbina { get; set; }
        public DateTime? DatumPlacanja { get; set; }
        public string? UplataId { get; set; }
        public int Kolicina { get; set; }
        public decimal Cena { get; set; }
        public decimal? Popust { get; set; }
        public int ApotekaProizvodId { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Kolicina <= 0)
            {
                yield return new ValidationResult(
                  "Kolicina odabranog proizvoda mora biti veca od 0.",
                  new[] { "JoinedCreateDTO" });
            }

        }
    }


}
