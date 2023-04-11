using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using System.Data;

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
        /*[Authorize(Roles = "Kupac")]
        [HttpGet("stavkeInPorudzbina/{porudzbinaId:int}")]
        public async Task<IActionResult> GetStavkeByPorudzbina([FromQuery] RequestParams requestParams, int porudzbinaId, [FromQuery] int kupacId)
        {
            try
            {
                var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

                if (korisnikId != kupacId) return Unauthorized("Nemate prava na ovu akciju.");

                var stavke = await _unitOfWork.StavkaPorudzbine.GetAllPagedListAsync(requestParams, 
                    q => q.PorudzbinaId == porudzbinaId && q.Porudzbina.KorisnikId == kupacId,
                    include: q => q.Include(x => x.ApotekaProizvod.Proizvod.TipProizvoda).Include(x => x.ApotekaProizvod.Apoteka));

                if (stavke == null) return NoContent();

                var results = _mapper.Map<List<StavkaDto>>(stavke);

                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serveska greska.");
            }
        }*/

        /// <summary>
        /// Vraća jednu stavku porudzbine na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Kupac")]
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
            catch (Exception)
            {
                return StatusCode(500, "Serveska greska.");
            }
        }

        /// <summary>
        /// Dodaje novu stavku u postojecu porudzbinu. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
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
            catch (Exception)
            {
                return StatusCode(500, "Serveska greska.");
            }
        }

        /// <summary>
        /// Azurira stavku porudzbine. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
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

                return Ok("Uspesna izmena.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Serveska greska.");
            }
        }

        /// <summary>
        /// Brise stavku porudzbine na osnovu id-ja. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
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
            catch (Exception)
            {
                return StatusCode(500, "Serveska greska.");
            }
        }
    }

  
}
