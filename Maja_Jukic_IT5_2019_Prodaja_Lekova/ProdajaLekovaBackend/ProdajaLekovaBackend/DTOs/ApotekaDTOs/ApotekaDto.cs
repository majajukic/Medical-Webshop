using ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs;
using ProdajaLekovaBackend.Models;

namespace ProdajaLekovaBackend.DTOs.ApotekaDTOs
{
    public class ApotekaDto
    {
        public int ApotekaId { get; set; }
        public string NazivApoteke { get; set; } = null!;
    }
}
