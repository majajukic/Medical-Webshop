using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public TipProizvodaController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Vraća sve tipove proizvoda.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetTipoviProizvoda()
        {
            try
            {
                var tipoviProizvoda = await _unitOfWork.TipProizvoda.GetAllAsync();

                if (tipoviProizvoda == null) return NoContent();

                var results = _mapper.Map<List<TipProizvodaDto>>(tipoviProizvoda);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća jedan tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetTipProizvoda")]
        public async Task<IActionResult> GetTipProizvoda(int id)
        {
            try
            {
                var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId == id);

                if (tipProizvoda == null) return NotFound();

                var result = _mapper.Map<TipProizvodaDto>(tipProizvoda);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Kreira tip proizvoda.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateTipProizvoda([FromBody] TipProizvodaCreateDto tipProizvodaDTO)
        {

            try
            {
                var tipProizvoda = _mapper.Map<TipProizvoda>(tipProizvodaDTO);

                await _unitOfWork.TipProizvoda.CreateAsync(tipProizvoda);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetTipProizvoda", new { id = tipProizvoda.TipProizvodaId }, tipProizvoda);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Azurira tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateTipProizvoda([FromBody] TipProizvodaUpdateDto tipProizvodaDTO)
        {

            try
            {
                var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId == tipProizvodaDTO.TipProizvodaId);

                if (tipProizvoda == null) return NotFound();

                _mapper.Map(tipProizvodaDTO, tipProizvoda);

                _unitOfWork.TipProizvoda.UpdateAsync(tipProizvoda);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Brise tip proizvoda na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTipProizvoda(int id)
        {
            try
            {
                var tipProizvoda = await _unitOfWork.TipProizvoda.GetAsync(q => q.TipProizvodaId  == id);

                if (tipProizvoda == null) return NotFound();

                await _unitOfWork.TipProizvoda.DeleteAsync(id);

                await _unitOfWork.Save();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
