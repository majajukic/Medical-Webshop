using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using ProdajaLekovaBackend.Services;

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
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetKorisnici([FromQuery] RequestParams requestParams)
        {
            try
            {
                var korisnici = await _unitOfWork.Korisnik.GetAllPagedListAsync(requestParams, orderBy: q => q.OrderBy(x => x.Ime));

                if (korisnici == null) return NoContent();

                var results = _mapper.Map<List<KorisnikDto>>(korisnici);

                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća jednog korisnika na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetKorisnik")]
        public async Task<IActionResult> GetKorisnik(int id)
        {
            try
            {
                var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

                if (korisnik == null) return NotFound("Korisnik nije pronadjen.");

                var result = _mapper.Map<KorisnikDto>(korisnik);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća podatke o trenutno ulogovanom korisniku (profil).
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpGet("profil")]
        public async Task<IActionResult> GetProfileDetails()
        {
            try
            {
                var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

                var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == korisnikId);

                if (korisnik == null) return NotFound("Korisnik nije pronadjen.");

                var result = _mapper.Map<KorisnikDto>(korisnik);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Kreira novog korisnika.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateKorisnik([FromBody] KorisnikCreateDto korisnikDTO)
        {

            try
            {
                var existingKorisnik = await _unitOfWork.Korisnik.GetAsync(q => q.Email == korisnikDTO.Email);

                if (existingKorisnik != null) return BadRequest("Korisnik sa datom mejl adresom vec postoji u bazi");

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(korisnikDTO.Lozinka);

                var korisnik = _mapper.Map<Korisnik>(korisnikDTO);

                korisnik.Lozinka = passwordHash;

                await _unitOfWork.Korisnik.CreateAsync(korisnik);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetKorisnik", new { id = korisnik.KorisnikId }, korisnik);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Azuriranje korisnickih naloga.
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpPut]
        public async Task<IActionResult> UpdateKorisnik([FromBody] KorisnikUpdateDto korisnikDTO)
        {

            try
            {
                var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == korisnikDTO.KorisnikId);

                if (korisnik == null) return NotFound("Korisnik nije pronadjen.");

                if (korisnikDTO.Lozinka.Equals(korisnik.Lozinka))
                {
                    korisnikDTO.Lozinka = korisnik.Lozinka;
                }
                else
                {
                    korisnikDTO.Lozinka = BCrypt.Net.BCrypt.HashPassword(korisnikDTO.Lozinka);
                }

                _mapper.Map(korisnikDTO, korisnik);

                _unitOfWork.Korisnik.UpdateAsync(korisnik);

                await _unitOfWork.Save();

                return Ok("Uspesna izmena");
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Brisanje korisnickih naloga.
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteKorisnik(int id)
        {
            try
            {
                var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

                if (korisnik == null) return NotFound("Korisnik nije pronadjen.");

                await _unitOfWork.Korisnik.DeleteAsync(id);

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
