using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/korisnik")]
    [ApiController]
    public class KorisnikController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public KorisnikController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Vraća sve korisnike.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetKorisnici([FromQuery] RequestParams requestParams)
        {
            try
            {
                var korisnici = await _unitOfWork.Korisnik.GetAllPagedListAsync(requestParams);

                if (korisnici == null) return NoContent();

                var results = _mapper.Map<List<KorisnikDto>>(korisnici);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća jednog korisnika na osnovu id-ja.
        /// </summary>
        [HttpGet("{id:int}", Name = "GetKorisnik")]
        public async Task<IActionResult> GetKorisnik(int id)
        {
            try
            {
                var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

                if (korisnik == null) return NotFound();

                var result = _mapper.Map<KorisnikDto>(korisnik);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Kreira novog korisnika.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateKorisnik([FromBody] KorisnikCreateDto korisnikDTO)
        {

            try
            {
                var korisnik = _mapper.Map<Korisnik>(korisnikDTO);

                await _unitOfWork.Korisnik.CreateAsync(korisnik);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetKorisnik", new { id = korisnik.KorisnikId }, korisnik);
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Azurira korisnika na osnovu id-ja.
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateKorisnik([FromBody] KorisnikUpdateDto korisnikDTO)
        {

            try
            {
                var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == korisnikDTO.KorisnikId);

                if (korisnik == null) return NotFound();

                _mapper.Map(korisnikDTO, korisnik);

                _unitOfWork.Korisnik.UpdateAsync(korisnik);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Brise korisnika na osnovu id-ja.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteKorisnik(int id)
        {
            try
            {
                var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

                if (korisnik == null) return NotFound();

                await _unitOfWork.Korisnik.DeleteAsync(id);

                await _unitOfWork.Save();

                return NoContent();
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }
    }
}
