using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/stavkaPorudzbine")]
    [ApiController]
    public class StavkaPorudzbineController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StavkaPorudzbineController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Vraća sve stavke porudzbine jedne porudzbine.
        /// </summary>
        [HttpGet("stavkeInPorudzbina")]
        public async Task<IActionResult> GetStavkeByPorudzbina([FromQuery] RequestParams requestParams, [FromQuery] int porudzbinaId)
        {
            try
            {
                var stavke = await _unitOfWork.StavkaPorudzbine.GetAllPagedListAsync(requestParams, 
                    q => q.PorudzbinaId == porudzbinaId,
                    include: q => q.Include(x => x.ApotekaProizvod.Proizvod.TipProizvoda).Include(x => x.ApotekaProizvod.Apoteka).Include(x => x.Porudzbina));

                if (stavke == null) return NoContent();

                var results = _mapper.Map<List<StavkaDto>>(stavke);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća jednu stavku porudzbine na sonovu id-ja.
        /// </summary>
        [HttpGet("{id:int}", Name = "GetStavkaPorudzbine")]
        public async Task<IActionResult> GetStavkaPorudzbine(int id)
        {
            try
            {
                var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == id);

                if (stavka == null) return NotFound();

                var result = _mapper.Map<StavkaDto>(stavka);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Dodaje novu stavku u postojecu porudzbinu. AKTIVIRA TRIGER
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddStavkaToPorudzbina([FromBody] StavkaCreateDto stavkaDTO)
        {

            try
            {
                var stavka = _mapper.Map<StavkaPorudzbine>(stavkaDTO);

                await _unitOfWork.StavkaPorudzbine.CreateAsync(stavka);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetStavkaPorudzbine", new { id = stavka.StavkaId }, stavka);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Azurira stavku porudzbine. AKTIVIRA TRIGER
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateStavkaPorudzbine([FromBody] StavkaUpdateDto stavkaDTO)
        {

            try
            {
                var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == stavkaDTO.StavkaId);

                if (stavka == null) return NotFound();

                _mapper.Map(stavkaDTO, stavka);

                _unitOfWork.StavkaPorudzbine.UpdateAsync(stavka);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Brise stavku porudzbine na osnovu id-ja. AKTIVIRA TRIGER
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStavkaPorudzbine(int id)
        {
            try
            {
                var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == id);

                if (stavka == null) return NotFound();

                await _unitOfWork.StavkaPorudzbine.DeleteAsync(id);

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
