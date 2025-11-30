using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.ProizvodDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/proizvod")]
    [ApiController]
    public class ProizvodController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ProizvodController> _logger;

        public ProizvodController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ProizvodController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća sve proizvode (naziv, proizvodjaca i tip).
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetProizvodi()
        {
            _logger.LogInformation("Fetching all products");
            var proizvodi = await _unitOfWork.Proizvod.GetAllAsync(include: q => q.Include(x => x.TipProizvoda),
                orderBy: q => q.OrderBy(x => x.NazivProizvoda));

            if (proizvodi == null) return NoContent();

            var results = _mapper.Map<List<ProizvodDto>>(proizvodi);
            _logger.LogInformation("Successfully fetched {Count} products", results.Count);

            return Ok(results);
        }

        /// <summary>
        /// Vraća jedan proizvod na osnovu id-ja (naziv, proizvodjaca i tip).
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetProizvod")]
        public async Task<IActionResult> GetProizvod(int id)
        {
            _logger.LogInformation("Fetching product with ID: {ProizvodId}", id);
            var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == id,
                include: q => q.Include(x => x.TipProizvoda));

            if (proizvod == null)
            {
                _logger.LogWarning("Product with ID {ProizvodId} not found", id);
                throw new KeyNotFoundException("Proizvod nije pronadjen.");
            }

            var result = _mapper.Map<ProizvodDto>(proizvod);
            _logger.LogInformation("Successfully fetched product with ID: {ProizvodId}", id);

            return Ok(result);
        }

        /// <summary>
        /// Kreiranje proizvoda.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProizvod([FromBody] ProizvodCreateDto proizvodDTO)
        {
            _logger.LogInformation("Creating new product: {NazivProizvoda}", proizvodDTO.NazivProizvoda);
            var proizvod = _mapper.Map<Proizvod>(proizvodDTO);

            await _unitOfWork.Proizvod.CreateAsync(proizvod);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully created product with ID: {ProizvodId}", proizvod.ProizvodId);

            return CreatedAtRoute("GetProizvod", new { id = proizvod.ProizvodId }, proizvod);
        }

        /// <summary>
        /// Azuriranje naziva proizvod, tipa i proizvodjaca za sve apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateProizvod([FromBody] ProizvodUpdateDto proizvodDTO)
        {
            _logger.LogInformation("Updating product with ID: {ProizvodId}", proizvodDTO.ProizvodId);
            var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == proizvodDTO.ProizvodId);

            if (proizvod == null)
            {
                _logger.LogWarning("Product with ID {ProizvodId} not found for update", proizvodDTO.ProizvodId);
                throw new KeyNotFoundException("Proizvod nije pronadjen");
            }

            _mapper.Map(proizvodDTO, proizvod);
            _unitOfWork.Proizvod.UpdateAsync(proizvod);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully updated product with ID: {ProizvodId}", proizvodDTO.ProizvodId);

            return Ok("Uspesna izmena.");
        }

        /// <summary>
        /// Brise proizvod iz svih apoteka u kojima se nalazi na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProizvod(int id)
        {
            _logger.LogInformation("Deleting product with ID: {ProizvodId}", id);
            var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == id);

            if (proizvod == null)
            {
                _logger.LogWarning("Product with ID {ProizvodId} not found for deletion", id);
                throw new KeyNotFoundException("Proizvod nije pronadjen.");
            }

            await _unitOfWork.Proizvod.DeleteAsync(id);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully deleted product with ID: {ProizvodId}", id);

            return NoContent();
        }
    }
}
