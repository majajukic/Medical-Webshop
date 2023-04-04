using ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs;
using ProdajaLekovaBackend.DTOs.TipProizvodaDTOs;

namespace ProdajaLekovaBackend.DTOs.ProizvodDTOs
{
    public class ProizvodDto
    {
        public int ProizvodId { get; set; }
        public string NazivProizvoda { get; set; } = null!;
        public string Proizvodjac { get; set; } = null!;
        public virtual TipProizvodaDto TipProizvoda { get; set; } = null!;
        
    }
}
