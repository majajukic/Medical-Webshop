using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.ApotekaDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/apoteka")]
    [ApiController]
    public class ApotekaController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ApotekaController> _logger;

        public ApotekaController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ApotekaController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća sve apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetApoteke()
        {
            _logger.LogInformation("Fetching all pharmacies");
            var apoteke = await _unitOfWork.Apoteka.GetAllAsync(orderBy: q => q.OrderBy(x => x.NazivApoteke));

            if (apoteke == null) return NoContent();

            var results = _mapper.Map<List<ApotekaDto>>(apoteke);
            _logger.LogInformation("Successfully fetched {Count} pharmacies", results.Count);

            return Ok(results);
        }

        /// <summary>
        /// Vraća jednu apoteku na sonovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name ="GetApoteka")]
        public async Task<IActionResult> GetApoteka(int id)
        {
            _logger.LogInformation("Fetching pharmacy with ID: {ApotekaId}", id);
            var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == id);

            if(apoteka == null)
            {
                _logger.LogWarning("Pharmacy with ID {ApotekaId} not found", id);
                throw new KeyNotFoundException("Apoteka nije pronadjena.");
            }

            var result = _mapper.Map<ApotekaDto>(apoteka);
            _logger.LogInformation("Successfully fetched pharmacy with ID: {ApotekaId}", id);

            return Ok(result);
        }

        /// <summary>
        /// Kreira apoteku.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateApoteka([FromBody] ApotekaCreateDto apotekaDTO)
        {
            _logger.LogInformation("Creating new pharmacy: {NazivApoteke}", apotekaDTO.NazivApoteke);
            var existingApoteka = await _unitOfWork.Apoteka.GetAsync(q => q.NazivApoteke == apotekaDTO.NazivApoteke);

            if (existingApoteka != null)
            {
                _logger.LogWarning("Pharmacy with name {NazivApoteke} already exists", apotekaDTO.NazivApoteke);
                throw new ArgumentException("Apoteka sa datim nazivom vec postoji u bazi.");
            }

            var apoteka = _mapper.Map<Apoteka>(apotekaDTO);

            await _unitOfWork.Apoteka.CreateAsync(apoteka);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully created pharmacy with ID: {ApotekaId}", apoteka.ApotekaId);

            return CreatedAtRoute("GetApoteka", new { id = apoteka.ApotekaId }, apoteka);
        }

        /// <summary>
        /// Azurira apoteku na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateApoteka([FromBody] ApotekaUpdateDto apotekaDTO)
        {
            _logger.LogInformation("Updating pharmacy with ID: {ApotekaId}", apotekaDTO.ApotekaId);
            var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == apotekaDTO.ApotekaId);

            if (apoteka == null)
            {
                _logger.LogWarning("Pharmacy with ID {ApotekaId} not found for update", apotekaDTO.ApotekaId);
                throw new KeyNotFoundException("Apoteka nije pronadjena.");
            }

            var existingApoteka = await _unitOfWork.Apoteka.GetAsync(q => q.NazivApoteke == apotekaDTO.NazivApoteke);

            if (existingApoteka != null)
            {
                _logger.LogWarning("Pharmacy with name {NazivApoteke} already exists", apotekaDTO.NazivApoteke);
                throw new ArgumentException("Apoteka sa datim nazivom vec postoji u bazi.");
            }

            _mapper.Map(apotekaDTO, apoteka);
            _unitOfWork.Apoteka.UpdateAsync(apoteka);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully updated pharmacy with ID: {ApotekaId}", apotekaDTO.ApotekaId);

            return Ok("Uspesna izmena");
        }

        /// <summary>
        /// Brise apoteku na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApoteka(int id)
        {
            _logger.LogInformation("Deleting pharmacy with ID: {ApotekaId}", id);
            var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == id);

            if (apoteka== null)
            {
                _logger.LogWarning("Pharmacy with ID {ApotekaId} not found for deletion", id);
                throw new KeyNotFoundException("Apoteka nije pronadjena.");
            }

            await _unitOfWork.Apoteka.DeleteAsync(id);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully deleted pharmacy with ID: {ApotekaId}", id);

            return NoContent();
        }
    }
}
