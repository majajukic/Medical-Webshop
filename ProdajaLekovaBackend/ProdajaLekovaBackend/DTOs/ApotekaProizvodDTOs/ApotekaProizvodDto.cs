using ProdajaLekovaBackend.DTOs.ApotekaDTOs;
using ProdajaLekovaBackend.DTOs.ProizvodDTOs;

namespace ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs
{
    public class ApotekaProizvodDto
    {
        public int ApotekaProizvodId { get; set; }
        public int? StanjeZaliha { get; set; }
        public string? Slika { get; set; }
        public decimal? PopustUprocentima { get; set; }
        public decimal CenaBezPopusta { get; set; }
        public decimal? CenaSaPopustom { get; set; }

        public virtual ApotekaDto Apoteka { get; set; } = null!;
        public virtual ProizvodDto Proizvod { get; set; } = null!;
    }
}
