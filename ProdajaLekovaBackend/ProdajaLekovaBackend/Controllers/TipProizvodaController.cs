using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.ApotekaDTOs;
using ProdajaLekovaBackend.DTOs.TipProizvodaDTOs;
using ProdajaLekovaBackend.Exceptions;
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
            var tipoviProizvoda = await _unitOfWork.TipProizvoda.GetAllAsync(orderBy: q => q.OrderBy(x => x.NazivTipaProizvoda));

            if (tipoviProizvoda == null) return NoContent();

            var results = _mapper.Map<List<TipProizvodaDto>>(tipoviProizvoda);

            return Ok(results);
        }

        /// <summary>
        /// Vraća jedan tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetTipProizvoda")]
        public async Task<IActionResult> GetTipProizvoda(int id)
        {
            var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId == id);

            if (tipProizvoda == null)
                throw new NotFoundException("Tip proizvoda", id);

            var result = _mapper.Map<TipProizvodaDto>(tipProizvoda);

            return Ok(result);
        }

        /// <summary>
        /// Kreira tip proizvoda.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateTipProizvoda([FromBody] TipProizvodaCreateDto tipProizvodaDTO)
        {
            var existingTip = await _unitOfWork.TipProizvoda.GetAsync(q => q.NazivTipaProizvoda == tipProizvodaDTO.NazivTipaProizvoda);

            if (existingTip != null)
                throw new BadRequestException("Tip proizvoda sa datim nazivom vec postoji u bazi.");

            var tipProizvoda = _mapper.Map<TipProizvoda>(tipProizvodaDTO);

            await _unitOfWork.TipProizvoda.CreateAsync(tipProizvoda);

            await _unitOfWork.Save();

            _logger.LogInformation("Created new TipProizvoda with ID: {TipProizvodaId}", tipProizvoda.TipProizvodaId);

            return CreatedAtRoute("GetTipProizvoda", new { id = tipProizvoda.TipProizvodaId }, tipProizvoda);
        }

        /// <summary>
        /// Azurira tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateTipProizvoda([FromBody] TipProizvodaUpdateDto tipProizvodaDTO)
        {
            var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId == tipProizvodaDTO.TipProizvodaId);

            if (tipProizvoda == null)
                throw new NotFoundException("Tip proizvoda", tipProizvodaDTO.TipProizvodaId);

            var existingTip = await _unitOfWork.TipProizvoda.GetAsync(q => q.NazivTipaProizvoda == tipProizvodaDTO.NazivTipaProizvoda);

            if (existingTip != null)
                throw new BadRequestException("Tip proizvoda sa datim nazivom vec postoji u bazi.");

            _mapper.Map(tipProizvodaDTO, tipProizvoda);

            _unitOfWork.TipProizvoda.UpdateAsync(tipProizvoda);

            await _unitOfWork.Save();

            _logger.LogInformation("Updated TipProizvoda with ID: {TipProizvodaId}", tipProizvodaDTO.TipProizvodaId);

            return Ok("Uspesna izmena");
        }

        /// <summary>
        /// Brise tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTipProizvoda(int id)
        {
            var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId  == id);

            if (tipProizvoda == null)
                throw new NotFoundException("Tip proizvoda", id);

            await _unitOfWork.TipProizvoda.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Deleted TipProizvoda with ID: {TipProizvodaId}", id);

            return NoContent();
        }
    }
}
