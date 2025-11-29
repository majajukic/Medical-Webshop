using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
                return StatusCode(500, "Serverska greska.");
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
                if (stavkaDTO.Kolicina <= 0)
                {
                    return BadRequest("Kolicina mora biti veca od nule.");
                }

                //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
                ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == stavkaDTO.ApotekaProizvodId);

                if (stavkaDTO.Kolicina > proizvod.StanjeZaliha) return BadRequest("Trenutno na stanju nema dovoljno trazenog proizvoda.");

                stavkaDTO.Popust ??= 0;

                var stavka = _mapper.Map<StavkaPorudzbine>(stavkaDTO);

                await _unitOfWork.StavkaPorudzbine.CreateAsync(stavka);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetStavkaPorudzbine", new { id = stavka.StavkaId }, stavka);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
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

                if (stavkaDTO.Kolicina <= 0)
                {
                    return BadRequest("Kolicina mora biti veca od nule.");
                }

                //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
                ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == stavka.ApotekaProizvodId);

                if (stavkaDTO.Kolicina > proizvod.StanjeZaliha) return BadRequest("Trenutno na stanju nema dovoljno trazenog proizvoda.");

                _mapper.Map(stavkaDTO, stavka);

                _unitOfWork.StavkaPorudzbine.UpdateAsync(stavka);

                await _unitOfWork.Save();

                return Ok("Uspesna izmena.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
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
                return StatusCode(500, "Serverska greska.");
            }
        }
    }

  
}
