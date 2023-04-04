using ProdajaLekovaBackend.DTOs.ProizvodDTOs;
using ProdajaLekovaBackend.Models;

namespace ProdajaLekovaBackend.DTOs.TipProizvodaDTOs
{
    public class TipProizvodaDto
    {
        public int TipProizvodaId { get; set; }
        public string NazivTipaProizvoda { get; set; } = null!;
    }
}
