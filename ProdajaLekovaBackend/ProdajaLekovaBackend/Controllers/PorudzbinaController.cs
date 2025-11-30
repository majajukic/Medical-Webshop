using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

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
            _logger.LogInformation("Fetching all paid porudzbine");

            var porudzbine = await _unitOfWork.Porudzbina.GetAllAsync(q => q.PlacenaPorudzbina == true,
                include: q => q.Include(x => x.Korisnik),
                orderBy: q => q.OrderByDescending(x => x.DatumKreiranja));

            if (porudzbine == null) return NoContent();

            var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

            _logger.LogInformation("Successfully retrieved {Count} porudzbine", results.Count);
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

            _logger.LogInformation("Fetching porudzbine for kupac: {KorisnikId}", korisnikId);

            var porudzbine = await _unitOfWork.Porudzbina.GetAllAsync(q => q.KorisnikId == korisnikId && q.PlacenaPorudzbina == true);

            if (porudzbine == null) return NoContent();

            var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

            _logger.LogInformation("Successfully retrieved {Count} porudzbine for kupac: {KorisnikId}", results.Count, korisnikId);
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

            _logger.LogInformation("Fetching korpa for kupac: {KorisnikId}", korisnikId);

            var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PlacenaPorudzbina == false && q.Korisnik.KorisnikId == korisnikId,
                include: q => q.Include(x => x.StavkaPorudzbine).ThenInclude(y => y.ApotekaProizvod).ThenInclude(z => z.Proizvod.TipProizvoda));

            if (porudzbina == null) return NoContent();

            var result = _mapper.Map<PorudzbinaDto>(porudzbina);

            _logger.LogInformation("Successfully retrieved korpa with {Count} items for kupac: {KorisnikId}", result.StavkaPorudzbine?.Count ?? 0, korisnikId);
            return Ok(result);
        }

        /// <summary>
        /// Vraća jednu porudzbinu na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Kupac, Admin")]
        [HttpGet("{porudzbinaId:int}", Name = "GetPorudzbina")]
        public async Task<IActionResult> GetPorudzbina(int porudzbinaId)
        {
            _logger.LogInformation("Fetching porudzbina with id: {PorudzbinaId}", porudzbinaId);

            var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaId,
                include: q => q.Include(x => x.StavkaPorudzbine).ThenInclude(y => y.ApotekaProizvod).ThenInclude(z => z.Proizvod.TipProizvoda));

            if (porudzbina == null)
            {
                _logger.LogWarning("Porudzbina with id {PorudzbinaId} not found", porudzbinaId);
                return NotFound("Porudzbina nije pronadjena.");
            }

            var result = _mapper.Map<PorudzbinaDto>(porudzbina);

            _logger.LogInformation("Successfully retrieved porudzbina with id: {PorudzbinaId}", porudzbinaId);
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

            _logger.LogInformation("Creating new porudzbina with stavka for kupac: {KorisnikId}, ApotekaProizvodId: {ApotekaProizvodId}", korisnikId, joinedDataDTO.ApotekaProizvodId);

            if (joinedDataDTO.Kolicina <= 0)
            {
                _logger.LogWarning("Invalid quantity {Kolicina} for order creation", joinedDataDTO.Kolicina);
                return BadRequest("Kolicina mora biti veca od nule.");
            }

            //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
            ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == joinedDataDTO.ApotekaProizvodId);

            if (joinedDataDTO.Kolicina > proizvod.StanjeZaliha)
            {
                _logger.LogWarning("Requested quantity {Kolicina} exceeds stock {StanjeZaliha} for ApotekaProizvodId: {ApotekaProizvodId}", joinedDataDTO.Kolicina, proizvod.StanjeZaliha, joinedDataDTO.ApotekaProizvodId);
                return BadRequest("Trenutno na stanju nema dovoljno trazenog proizvoda.");
            }

            joinedDataDTO.BrojPorudzbine = $"#{DateTime.UtcNow:yyyyMMddHHmmss}{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";

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

            _logger.LogInformation("Successfully created porudzbina with id: {PorudzbinaId} for kupac: {KorisnikId}", porudzbina.PorudzbinaId, korisnikId);
            return CreatedAtRoute("GetPorudzbina", new { porudzbinaId = porudzbina.PorudzbinaId }, porudzbina);
        }

        /// <summary>
        /// Brise porudzbinu i sve njene stavke na osnovu id-ja porudzbine.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePorudzbina(int id)
        {
            _logger.LogInformation("Deleting porudzbina with id: {Id}", id);

            var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == id);

            if (porudzbina == null)
            {
                _logger.LogWarning("Porudzbina with id {Id} not found for deletion", id);
                return NotFound("Porudzbina nije pronadjena.");
            }

            await _unitOfWork.Porudzbina.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Successfully deleted porudzbina with id: {Id}", id);
            return NoContent();
        }
    }
}
