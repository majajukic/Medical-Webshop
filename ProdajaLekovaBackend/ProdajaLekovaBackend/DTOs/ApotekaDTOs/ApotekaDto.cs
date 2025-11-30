using Newtonsoft.Json;

namespace ProdajaLekovaBackend.DTOs.ApotekaDTOs
{
    public class ApotekaDto
    {
        [JsonRequired]
        public int ApotekaId { get; set; }
        public string NazivApoteke { get; set; } = null!;
    }
}
