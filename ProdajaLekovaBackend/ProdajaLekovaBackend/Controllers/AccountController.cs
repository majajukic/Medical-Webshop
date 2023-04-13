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

        public AccountController(IUnitOfWork unitOfWork, IAuthManager authManager)
        {
            _unitOfWork = unitOfWork; 
            _authManager = authManager;
        }

        /// <summary>
        /// Registracija (kreiranje) korisnika.
        /// </summary>
        [HttpPost]
        [Route("registracija")]
        public async Task<IActionResult> Register([FromBody] KorisnikRegisterDto korisnikDTO)
        {
            try
            {
                var existingKorisnik = await _unitOfWork.Korisnik.GetAsync(q => q.Email == korisnikDTO.Email);

                if (existingKorisnik != null)
                {
                    return BadRequest("Email addresa vec postoji u bazi.");
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
                    //TipKorisnika = (TipKorisnikaEnum)1
                };

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(korisnikDTO.Lozinka);

                korisnik.Lozinka = passwordHash;

                korisnik.TipKorisnika = (TipKorisnikaEnum)1;

                await _unitOfWork.Korisnik.CreateAsync(korisnik);

                await _unitOfWork.Save();

                return Ok(new { message = "Registracija uspesna!" });

            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Prijava korisnika.
        /// </summary>
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] KorisnikLoginDto korisnikDTO)
        {
            try
            {
                if (!await _authManager.ValidateKorisnik(korisnikDTO)) return Unauthorized("Nalog ne postoji ili su kredencijali pogresni.");

                return Ok(new { Token = await _authManager.CreateToken(korisnikDTO) });
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }   
    }
}

