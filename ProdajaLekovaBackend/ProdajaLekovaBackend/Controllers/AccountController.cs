using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using ProdajaLekovaBackend.Services;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuthManager _authManager;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IUnitOfWork unitOfWork, IAuthManager authManager, ILogger<AccountController> logger)
        {
            _unitOfWork = unitOfWork;
            _authManager = authManager;
            _logger = logger;
        }

        /// <summary>
        /// Registracija (kreiranje) korisnika.
        /// </summary>
        [HttpPost]
        [Route("registracija")]
        public async Task<IActionResult> Register([FromBody] KorisnikRegisterDto korisnikDTO)
        {
            _logger.LogInformation("New user registration attempt for email: {Email}", korisnikDTO.Email);
            var existingKorisnik = await _unitOfWork.Korisnik.GetAsync(q => q.Email == korisnikDTO.Email);

            if (existingKorisnik != null)
            {
                _logger.LogWarning("Registration failed: Email {Email} already exists", korisnikDTO.Email);
                throw new ArgumentException("Email addresa vec postoji u bazi.");
            }

            var korisnik = new Korisnik
            {
                Email = korisnikDTO.Email,
                Ime = korisnikDTO.Ime,
                Prezime = korisnikDTO.Prezime,
                BrojTelefona = korisnikDTO.BrojTelefona,
                Ulica = korisnikDTO.Ulica,
                Broj = korisnikDTO.Broj,
                Mesto = korisnikDTO.Mesto,
            };

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(korisnikDTO.Lozinka);
            korisnik.Lozinka = passwordHash;
            korisnik.TipKorisnika = (TipKorisnikaEnum)1;

            await _unitOfWork.Korisnik.CreateAsync(korisnik);
            await _unitOfWork.Save();

            _logger.LogInformation("Successfully registered user with email: {Email}", korisnikDTO.Email);

            return Ok(new { message = "Registracija uspesna!" });
        }

        /// <summary>
        /// Prijava korisnika.
        /// </summary>
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] KorisnikLoginDto korisnikDTO)
        {
            _logger.LogInformation("Login attempt for email: {Email}", korisnikDTO.Email);

            if (!await _authManager.ValidateKorisnik(korisnikDTO))
            {
                _logger.LogWarning("Login failed for email: {Email}", korisnikDTO.Email);
                throw new ArgumentException("Nalog ne postoji ili su kredencijali pogresni.");
            }

            _logger.LogInformation("Successful login for email: {Email}", korisnikDTO.Email);

            return Ok(new { Token = await _authManager.CreateToken(korisnikDTO) });
        }   
    }
}

