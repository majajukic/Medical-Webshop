using AutoMapper;
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
        [HttpGet]
        public async Task<IActionResult> GetApoteke()
        {
            try
            {
                var apoteke = await _unitOfWork.Apoteka.GetAllAsync(orderBy: q => q.OrderBy(x => x.NazivApoteke));//kako bi se apoteke izlistale od A-Z

                if (apoteke == null) return NoContent();

                var results = _mapper.Map<List<ApotekaDto>>(apoteke);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća jednu apoteku na sonovu id-ja.
        /// </summary>
        [HttpGet("{id:int}", Name ="GetApoteka")]
        public async Task<IActionResult> GetApoteka(int id)
        {
            try
            {
                var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == id);

                if(apoteka == null) return NotFound();

                var result = _mapper.Map<ApotekaDto>(apoteka);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Kreira apoteku.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateApoteka([FromBody] ApotekaCreateDto apotekaDTO)
        {

            try
            {
                var apoteka = _mapper.Map<Apoteka>(apotekaDTO);

                await _unitOfWork.Apoteka.CreateAsync(apoteka);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetApoteka", new { id = apoteka.ApotekaId }, apoteka);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Azurira apoteku na osnovu id-ja.
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateApoteka([FromBody] ApotekaUpdateDto apotekaDTO)
        {

            try
            {
                var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == apotekaDTO.ApotekaId);

                if (apoteka == null) return NotFound();

                _mapper.Map(apotekaDTO, apoteka);

                _unitOfWork.Apoteka.UpdateAsync(apoteka);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Brise apoteku na osnovu id-ja.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApoteka(int id)
        {
            try
            {
                var apoteka = await _unitOfWork.Apoteka.GetAsync(q => q.ApotekaId == id);

                if (apoteka== null) return NotFound();

                await _unitOfWork.Apoteka.DeleteAsync(id);

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
