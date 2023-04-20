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
                var tipoviProizvoda = await _unitOfWork.TipProizvoda.GetAllAsync(orderBy: q => q.OrderBy(x => x.NazivTipaProizvoda));

                if (tipoviProizvoda == null) return NoContent();

                var results = _mapper.Map<List<TipProizvodaDto>>(tipoviProizvoda);

                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
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

                if (tipProizvoda == null) return NotFound("Tip proizvoda nije pronadjen.");

                var result = _mapper.Map<TipProizvodaDto>(tipProizvoda);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
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
                var existingTip = await _unitOfWork.TipProizvoda.GetAsync(q => q.NazivTipaProizvoda == tipProizvodaDTO.NazivTipaProizvoda);

                if (existingTip != null) return BadRequest("Tip proizvoda sa datim nazivom vec postoji u bazi.");

                var tipProizvoda = _mapper.Map<TipProizvoda>(tipProizvodaDTO);

                await _unitOfWork.TipProizvoda.CreateAsync(tipProizvoda);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetTipProizvoda", new { id = tipProizvoda.TipProizvodaId }, tipProizvoda);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
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

                if (tipProizvoda == null) return NotFound("Tip proizvoda nije pronadjen.");

                var existingTip = await _unitOfWork.TipProizvoda.GetAsync(q => q.NazivTipaProizvoda == tipProizvodaDTO.NazivTipaProizvoda);

                if (existingTip != null) return BadRequest("Tip proizvoda sa datim nazivom vec postoji u bazi.");

                _mapper.Map(tipProizvodaDTO, tipProizvoda);

                _unitOfWork.TipProizvoda.UpdateAsync(tipProizvoda);

                await _unitOfWork.Save();

                return Ok("Uspesna izmena");
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
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

                if (tipProizvoda == null) return NotFound("Tip proizvoda nije pronadjen.");

                await _unitOfWork.TipProizvoda.DeleteAsync(id);

                await _unitOfWork.Save();

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }
    }
}
