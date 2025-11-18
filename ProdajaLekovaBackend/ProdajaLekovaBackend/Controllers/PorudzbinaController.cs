using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Exceptions;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using System.Data;
using System.Security.Claims;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/porudzbina")]
    [ApiController]
    public class PorudzbinaController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<PorudzbinaController> _logger;

        public PorudzbinaController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<PorudzbinaController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća sve porudzbine.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetPorudzbine()
        {
            var porudzbine = await _unitOfWork.Porudzbina.GetAllAsync(q => q.PlacenaPorudzbina == true,
                include: q => q.Include(x => x.Korisnik),
                orderBy: q => q.OrderByDescending(x => x.DatumKreiranja));

            if (porudzbine == null) return NoContent();

            var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

            return Ok(results);
        }

        /// <summary>
        /// Vraća sve porudzbine jednog kupca.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpGet("porudzbineByKupac")]
        public async Task<IActionResult> GetPorudzbineByKupac()
        {
            var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

            var porudzbine = await _unitOfWork.Porudzbina.GetAllAsync(q => q.KorisnikId == korisnikId && q.PlacenaPorudzbina == true);

            if (porudzbine == null) return NoContent();

            var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

            return Ok(results);
        }

        /// <summary>
        /// Vraća sadrzaj korpe.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpGet("korpa")]
        public async Task<IActionResult> GetKorpa()
        {
            var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

            var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PlacenaPorudzbina == false && q.Korisnik.KorisnikId == korisnikId,
                include: q => q.Include(x => x.StavkaPorudzbine).ThenInclude(y => y.ApotekaProizvod).ThenInclude(z => z.Proizvod.TipProizvoda));

            if (porudzbina == null) return NoContent();

            var result = _mapper.Map<PorudzbinaDto>(porudzbina);

            return Ok(result);
        }

        /// <summary>
        /// Vraća jednu porudzbinu na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Kupac, Admin")]
        [HttpGet("{porudzbinaId:int}", Name = "GetPorudzbina")]
        public async Task<IActionResult> GetPorudzbina(int porudzbinaId)
        {
            var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaId,
                include: q => q.Include(x => x.StavkaPorudzbine).ThenInclude(y => y.ApotekaProizvod).ThenInclude(z => z.Proizvod.TipProizvoda));

            if (porudzbina == null)
                throw new NotFoundException("Porudzbina", porudzbinaId);

            var result = _mapper.Map<PorudzbinaDto>(porudzbina);

            return Ok(result);
        }

        /// <summary>
        /// Kreira porudzbinu zajedno sa prvom stavkom koja se dodaje u korpu.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpPost]
        public async Task<IActionResult> CreatePorudzbinaWithStavka([FromBody] JoinedCreateDto joinedDataDTO)
        {
            var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

            //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
            ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == joinedDataDTO.ApotekaProizvodId);

            if (joinedDataDTO.Kolicina > proizvod.StanjeZaliha)
                throw new BadRequestException("Trenutno na stanju nema dovoljno trazenog proizvoda.");

            //generisanje random broja porudzbine
            Random rnd = new();

            int brojPorudzbine = rnd.Next(10000, 99999);

            joinedDataDTO.BrojPorudzbine = "#" + brojPorudzbine.ToString();

            //postavljanje vrednosti za ostala obelezja
            joinedDataDTO.DatumKreiranja = DateTime.Now;

            joinedDataDTO.PlacenaPorudzbina = false;

            joinedDataDTO.Popust ??= 0;

            //kreiranje porudzbine
            PorudzbinaCreateDto porudzbinaDTO = new PorudzbinaCreateDto
            {
                BrojPorudzbine = joinedDataDTO.BrojPorudzbine,
                DatumKreiranja = (DateTime)joinedDataDTO.DatumKreiranja,
                UkupanIznos = joinedDataDTO.UkupanIznos,
                PlacenaPorudzbina = (bool)joinedDataDTO.PlacenaPorudzbina,
                DatumPlacanja = joinedDataDTO.DatumPlacanja,
                UplataId = joinedDataDTO.UplataId,
                KorisnikId = korisnikId
            };

            var porudzbina = _mapper.Map<Porudzbina>(porudzbinaDTO);

            await _unitOfWork.Porudzbina.CreateAsync(porudzbina);

            await _unitOfWork.Save();

            //uzimanje id vrednosti kreirane porudzbine
            int porudzbinaIdKreirani = porudzbina.PorudzbinaId;

            //dodavanje stavke u kreiranu porudzbinu
            StavkaCreateDto stavkaDTO = new StavkaCreateDto
            {
                Kolicina = joinedDataDTO.Kolicina,
                Cena = joinedDataDTO.Cena,
                Popust = joinedDataDTO.Popust,
                PorudzbinaId = porudzbinaIdKreirani,
                ApotekaProizvodId = joinedDataDTO.ApotekaProizvodId
            };

            var stavka = _mapper.Map<StavkaPorudzbine>(stavkaDTO);

            await _unitOfWork.StavkaPorudzbine.CreateAsync(stavka);

            await _unitOfWork.Save();

            _logger.LogInformation("Created new Porudzbina with ID: {PorudzbinaId}", porudzbina.PorudzbinaId);

            return CreatedAtRoute("GetPorudzbina", new { porudzbinaId = porudzbina.PorudzbinaId }, porudzbina);
        }

        /// <summary>
        /// Brise porudzbinu i sve njene stavke na osnovu id-ja porudzbine.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePorudzbina(int id)
        {
            var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == id);

            if (porudzbina == null)
                throw new NotFoundException("Porudzbina", id);

            await _unitOfWork.Porudzbina.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Deleted Porudzbina with ID: {PorudzbinaId}", id);

            return NoContent();
        }
    }
}
