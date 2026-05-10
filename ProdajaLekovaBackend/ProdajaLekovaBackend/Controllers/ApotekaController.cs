using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public ApotekaController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Vraća sve apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetApoteke()
        {
            try
            {
                var apoteke = await _unitOfWork.Apoteka.GetAllAsync(orderBy: q => q.OrderBy(x => x.NazivApoteke));

                if (apoteke == null) return NoContent();

                var results = _mapper.Map<List<ApotekaDto>>(apoteke);

                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća jednu apoteku na sonovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name ="GetApoteka")]
        public async Task<IActionResult> GetApoteka(int id)
        {
            try
            {
                var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == id);

                if(apoteka == null) return NotFound("Apoteka nije pronadjena.");

                var result = _mapper.Map<ApotekaDto>(apoteka);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Kreira apoteku.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateApoteka([FromBody] ApotekaCreateDto apotekaDTO)
        {

            try
            {
                var existingApoteka = await _unitOfWork.Apoteka.GetAsync(q => q.NazivApoteke == apotekaDTO.NazivApoteke);

                if (existingApoteka != null) return BadRequest("Apoteka sa datim nazivom vec postoji u bazi.");

                var apoteka = _mapper.Map<Apoteka>(apotekaDTO);

                await _unitOfWork.Apoteka.CreateAsync(apoteka);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetApoteka", new { id = apoteka.ApotekaId }, apoteka);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Azurira apoteku na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateApoteka([FromBody] ApotekaUpdateDto apotekaDTO)
        {

            try
            {

                var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == apotekaDTO.ApotekaId);

                if (apoteka == null) return NotFound("Apoteka nije pronadjena.");

                var existingApoteka = await _unitOfWork.Apoteka.GetAsync(q => q.NazivApoteke == apotekaDTO.NazivApoteke);

                if (existingApoteka != null) return BadRequest("Apoteka sa datim nazivom vec postoji u bazi.");

                _mapper.Map(apotekaDTO, apoteka);

                _unitOfWork.Apoteka.UpdateAsync(apoteka);

                await _unitOfWork.Save();

                return Ok("Uspesna izmena");
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Brise apoteku na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApoteka(int id)
        {
            try
            {
                var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == id);

                if (apoteka== null) return NotFound("Apoteka nije pronadjena.");

                await _unitOfWork.Apoteka.DeleteAsync(id);

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
