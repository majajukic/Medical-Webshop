using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.Exceptions;
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
        private readonly ILogger<KorisnikController> _logger;

        public KorisnikController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<KorisnikController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća sve korisnike.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetKorisnici()
        {
            var korisnici = await _unitOfWork.Korisnik.GetAllAsync(orderBy: q => q.OrderBy(x => x.Ime));

            if (korisnici == null) return NoContent();

            var results = _mapper.Map<List<KorisnikDto>>(korisnici);

            return Ok(results);
        }

        /// <summary>
        /// Vraća jednog korisnika na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetKorisnik")]
        public async Task<IActionResult> GetKorisnik(int id)
        {
            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

            if (korisnik == null)
                throw new NotFoundException("Korisnik", id);

            var result = _mapper.Map<KorisnikDto>(korisnik);

            return Ok(result);
        }

        /// <summary>
        /// Vraća podatke o trenutno ulogovanom korisniku (profil).
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpGet("profil")]
        public async Task<IActionResult> GetProfileDetails()
        {
            var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == korisnikId);

            if (korisnik == null)
                throw new NotFoundException("Korisnik", korisnikId);

            var result = _mapper.Map<KorisnikDto>(korisnik);

            return Ok(result);
        }

        /// <summary>
        /// Kreira novog korisnika.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateKorisnik([FromBody] KorisnikCreateDto korisnikDTO)
        {
            var existingKorisnik = await _unitOfWork.Korisnik.GetAsync(q => q.Email == korisnikDTO.Email);

            if (existingKorisnik != null)
                throw new BadRequestException("Korisnik sa datom mejl adresom vec postoji u bazi");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(korisnikDTO.Lozinka);

            var korisnik = _mapper.Map<Korisnik>(korisnikDTO);

            korisnik.Lozinka = passwordHash;

            await _unitOfWork.Korisnik.CreateAsync(korisnik);

            await _unitOfWork.Save();

            _logger.LogInformation("Created new Korisnik with ID: {KorisnikId}", korisnik.KorisnikId);

            return CreatedAtRoute("GetKorisnik", new { id = korisnik.KorisnikId }, korisnik);
        }

        /// <summary>
        /// Azuriranje korisnickih naloga.
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpPut]
        public async Task<IActionResult> UpdateKorisnik([FromBody] KorisnikUpdateDto korisnikDTO)
        {
            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == korisnikDTO.KorisnikId);

            if (korisnik == null)
                throw new NotFoundException("Korisnik", korisnikDTO.KorisnikId);

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

            _logger.LogInformation("Updated Korisnik with ID: {KorisnikId}", korisnikDTO.KorisnikId);

            return Ok("Uspesna izmena");
        }

        /// <summary>
        /// Brisanje korisnickih naloga.
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteKorisnik(int id)
        {
            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

            if (korisnik == null)
                throw new NotFoundException("Korisnik", id);

            await _unitOfWork.Korisnik.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Deleted Korisnik with ID: {KorisnikId}", id);

            return NoContent();
        }
    }
}
