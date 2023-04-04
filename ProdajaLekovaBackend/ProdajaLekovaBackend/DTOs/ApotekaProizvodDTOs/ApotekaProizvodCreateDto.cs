using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs
{
    public class ApotekaProizvodCreateDto
    {
        [Required(ErrorMessage = "Obavezno je uneti id proizvoda.")]
        public int ProizvodId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti id apoteke.")]
        public int ApotekaId { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti stanje zaliha.")]
        public int StanjeZaliha { get; set; }
        public string? Slika { get; set; }
        public decimal? PopustUprocentima { get; set; }

        [Required(ErrorMessage = "Obavezno je uneti cenu proizvoda.")]
        public decimal CenaBezPopusta { get; set; }
    }
}
