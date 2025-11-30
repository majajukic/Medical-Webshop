using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.Constants;
using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using System.Security.Claims;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/korisnik")]
    [ApiController]
    public class KorisnikController : ControllerBase
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
            _logger.LogInformation("Fetching all users");
            var korisnici = await _unitOfWork.Korisnik.GetAllAsync(orderBy: q => q.OrderBy(x => x.Ime));

            if (korisnici == null) return NoContent();

            var results = _mapper.Map<List<KorisnikDto>>(korisnici);
            _logger.LogInformation("Successfully fetched {Count} users", results.Count);

            return Ok(results);
        }

        /// <summary>
        /// Vraća jednog korisnika na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetKorisnik")]
        public async Task<IActionResult> GetKorisnik(int id)
        {
            _logger.LogInformation("Fetching user with ID: {KorisnikId}", id);
            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

            if (korisnik == null)
            {
                _logger.LogWarning("User with ID {KorisnikId} not found", id);
                throw new KeyNotFoundException(ErrorMessages.KorisnikNotFound);
            }

            var result = _mapper.Map<KorisnikDto>(korisnik);
            _logger.LogInformation("Successfully fetched user with ID: {KorisnikId}", id);

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
            _logger.LogInformation("Fetching profile details for user ID: {KorisnikId}", korisnikId);

            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == korisnikId);

            if (korisnik == null)
            {
                _logger.LogWarning("User with ID {KorisnikId} not found", korisnikId);
                throw new KeyNotFoundException(ErrorMessages.KorisnikNotFound);
            }

            var result = _mapper.Map<KorisnikDto>(korisnik);
            _logger.LogInformation("Successfully fetched profile for user ID: {KorisnikId}", korisnikId);

            return Ok(result);
        }

        /// <summary>
        /// Kreira novog korisnika.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateKorisnik([FromBody] KorisnikCreateDto korisnikDTO)
        {
            _logger.LogInformation("Creating new user with email: {Email}", korisnikDTO.Email);
            var existingKorisnik = await _unitOfWork.Korisnik.GetAsync(q => q.Email == korisnikDTO.Email);

            if (existingKorisnik != null)
            {
                _logger.LogWarning("User with email {Email} already exists", korisnikDTO.Email);
                throw new ArgumentException("Korisnik sa datom mejl adresom vec postoji u bazi");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(korisnikDTO.Lozinka);

            var korisnik = _mapper.Map<Korisnik>(korisnikDTO);
            korisnik.Lozinka = passwordHash;

            await _unitOfWork.Korisnik.CreateAsync(korisnik);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully created user with ID: {KorisnikId}", korisnik.KorisnikId);

            return CreatedAtRoute("GetKorisnik", new { id = korisnik.KorisnikId }, korisnik);
        }

        /// <summary>
        /// Azuriranje korisnickih naloga.
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpPut]
        public async Task<IActionResult> UpdateKorisnik([FromBody] KorisnikUpdateDto korisnikDTO)
        {
            var currentUserId = int.Parse(User.FindFirst("Id")?.Value);
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            _logger.LogInformation("User {CurrentUserId} attempting to update user {TargetUserId}", currentUserId, korisnikDTO.KorisnikId);

            if (currentUserRole == "Kupac" && currentUserId != korisnikDTO.KorisnikId)
            {
                _logger.LogWarning("User {CurrentUserId} attempted to update another user's account", currentUserId);
                throw new UnauthorizedAccessException("Mozete azurirati samo svoj nalog.");
            }

            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == korisnikDTO.KorisnikId);

            if (korisnik == null)
            {
                _logger.LogWarning("User with ID {KorisnikId} not found for update", korisnikDTO.KorisnikId);
                throw new KeyNotFoundException(ErrorMessages.KorisnikNotFound);
            }

            if (!BCrypt.Net.BCrypt.Verify(korisnikDTO.Lozinka, korisnik.Lozinka))
            {
                korisnikDTO.Lozinka = BCrypt.Net.BCrypt.HashPassword(korisnikDTO.Lozinka);
            }
            else
            {
                korisnikDTO.Lozinka = korisnik.Lozinka;
            }

            _mapper.Map(korisnikDTO, korisnik);
            _unitOfWork.Korisnik.UpdateAsync(korisnik);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully updated user with ID: {KorisnikId}", korisnikDTO.KorisnikId);

            return Ok("Uspesna izmena");
        }

        /// <summary>
        /// Brisanje korisnickih naloga.
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteKorisnik(int id)
        {
            var currentUserId = int.Parse(User.FindFirst("Id")?.Value);
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            _logger.LogInformation("User {CurrentUserId} attempting to delete user {TargetUserId}", currentUserId, id);

            if (currentUserRole == "Kupac" && currentUserId != id)
            {
                _logger.LogWarning("User {CurrentUserId} attempted to delete another user's account", currentUserId);
                throw new UnauthorizedAccessException("Mozete obrisati samo svoj nalog.");
            }

            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.KorisnikId == id);

            if (korisnik == null)
            {
                _logger.LogWarning("User with ID {KorisnikId} not found for deletion", id);
                throw new KeyNotFoundException(ErrorMessages.KorisnikNotFound);
            }

            await _unitOfWork.Korisnik.DeleteAsync(id);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully deleted user with ID: {KorisnikId}", id);

            return NoContent();
        }
    }
}
