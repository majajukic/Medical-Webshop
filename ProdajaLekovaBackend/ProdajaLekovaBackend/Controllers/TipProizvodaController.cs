using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.ApotekaDTOs;
using ProdajaLekovaBackend.DTOs.TipProizvodaDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/tipProizvoda")]
    [ApiController]
    public class TipProizvodaController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<TipProizvodaController> _logger;

        public TipProizvodaController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<TipProizvodaController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća sve tipove proizvoda.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetTipoviProizvoda()
        {
            _logger.LogInformation("Fetching all product types");
            var tipoviProizvoda = await _unitOfWork.TipProizvoda.GetAllAsync(orderBy: q => q.OrderBy(x => x.NazivTipaProizvoda));

            if (tipoviProizvoda == null) return NoContent();

            var results = _mapper.Map<List<TipProizvodaDto>>(tipoviProizvoda);
            _logger.LogInformation("Successfully fetched {Count} product types", results.Count);

            return Ok(results);
        }

        /// <summary>
        /// Vraća jedan tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetTipProizvoda")]
        public async Task<IActionResult> GetTipProizvoda(int id)
        {
            _logger.LogInformation("Fetching product type with ID: {TipProizvodaId}", id);
            var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId == id);

            if (tipProizvoda == null)
            {
                _logger.LogWarning("Product type with ID {TipProizvodaId} not found", id);
                throw new KeyNotFoundException("Tip proizvoda nije pronadjen.");
            }

            var result = _mapper.Map<TipProizvodaDto>(tipProizvoda);
            _logger.LogInformation("Successfully fetched product type with ID: {TipProizvodaId}", id);

            return Ok(result);
        }

        /// <summary>
        /// Kreira tip proizvoda.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateTipProizvoda([FromBody] TipProizvodaCreateDto tipProizvodaDTO)
        {
            _logger.LogInformation("Creating new product type: {NazivTipaProizvoda}", tipProizvodaDTO.NazivTipaProizvoda);
            var existingTip = await _unitOfWork.TipProizvoda.GetAsync(q => q.NazivTipaProizvoda == tipProizvodaDTO.NazivTipaProizvoda);

            if (existingTip != null)
            {
                _logger.LogWarning("Product type with name {NazivTipaProizvoda} already exists", tipProizvodaDTO.NazivTipaProizvoda);
                throw new ArgumentException("Tip proizvoda sa datim nazivom vec postoji u bazi.");
            }

            var tipProizvoda = _mapper.Map<TipProizvoda>(tipProizvodaDTO);

            await _unitOfWork.TipProizvoda.CreateAsync(tipProizvoda);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully created product type with ID: {TipProizvodaId}", tipProizvoda.TipProizvodaId);

            return CreatedAtRoute("GetTipProizvoda", new { id = tipProizvoda.TipProizvodaId }, tipProizvoda);
        }

        /// <summary>
        /// Azurira tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateTipProizvoda([FromBody] TipProizvodaUpdateDto tipProizvodaDTO)
        {
            _logger.LogInformation("Updating product type with ID: {TipProizvodaId}", tipProizvodaDTO.TipProizvodaId);
            var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId == tipProizvodaDTO.TipProizvodaId);

            if (tipProizvoda == null)
            {
                _logger.LogWarning("Product type with ID {TipProizvodaId} not found for update", tipProizvodaDTO.TipProizvodaId);
                throw new KeyNotFoundException("Tip proizvoda nije pronadjen.");
            }

            var existingTip = await _unitOfWork.TipProizvoda.GetAsync(q => q.NazivTipaProizvoda == tipProizvodaDTO.NazivTipaProizvoda);

            if (existingTip != null)
            {
                _logger.LogWarning("Product type with name {NazivTipaProizvoda} already exists", tipProizvodaDTO.NazivTipaProizvoda);
                throw new ArgumentException("Tip proizvoda sa datim nazivom vec postoji u bazi.");
            }

            _mapper.Map(tipProizvodaDTO, tipProizvoda);
            _unitOfWork.TipProizvoda.UpdateAsync(tipProizvoda);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully updated product type with ID: {TipProizvodaId}", tipProizvodaDTO.TipProizvodaId);

            return Ok("Uspesna izmena");
        }

        /// <summary>
        /// Brise tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTipProizvoda(int id)
        {
            _logger.LogInformation("Deleting product type with ID: {TipProizvodaId}", id);
            var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId  == id);

            if (tipProizvoda == null)
            {
                _logger.LogWarning("Product type with ID {TipProizvodaId} not found for deletion", id);
                throw new KeyNotFoundException("Tip proizvoda nije pronadjen.");
            }

            await _unitOfWork.TipProizvoda.DeleteAsync(id);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully deleted product type with ID: {TipProizvodaId}", id);

            return NoContent();
        }
    }
}
