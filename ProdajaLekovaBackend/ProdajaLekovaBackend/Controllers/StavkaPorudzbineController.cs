using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/stavkaPorudzbine")]
    [ApiController]
    public class StavkaPorudzbineController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<StavkaPorudzbineController> _logger;

        public StavkaPorudzbineController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<StavkaPorudzbineController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća jednu stavku porudzbine na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpGet("{id:int}", Name = "GetStavkaPorudzbine")]
        public async Task<IActionResult> GetStavkaPorudzbine(int id)
        {
            _logger.LogInformation("Fetching stavka porudzbine with id: {Id}", id);

            var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == id);

            if (stavka == null)
            {
                _logger.LogWarning("Stavka porudzbine with id {Id} not found", id);
                return NotFound();
            }

            var result = _mapper.Map<StavkaDto>(stavka);

            _logger.LogInformation("Successfully retrieved stavka porudzbine with id: {Id}", id);
            return Ok(result);
        }

        /// <summary>
        /// Dodaje novu stavku u postojecu porudzbinu. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpPost]
        public async Task<IActionResult> AddStavkaToPorudzbina([FromBody] StavkaCreateDto stavkaDTO)
        {
            _logger.LogInformation("Adding stavka to porudzbina: PorudzbinaId={PorudzbinaId}, ApotekaProizvodId={ApotekaProizvodId}, Kolicina={Kolicina}", stavkaDTO.PorudzbinaId, stavkaDTO.ApotekaProizvodId, stavkaDTO.Kolicina);

            if (stavkaDTO.Kolicina <= 0)
            {
                _logger.LogWarning("Invalid quantity {Kolicina} for stavka creation", stavkaDTO.Kolicina);
                return BadRequest("Kolicina mora biti veca od nule.");
            }

            //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
            ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == stavkaDTO.ApotekaProizvodId);

            if (stavkaDTO.Kolicina > proizvod.StanjeZaliha)
            {
                _logger.LogWarning("Requested quantity {Kolicina} exceeds stock {StanjeZaliha} for ApotekaProizvodId: {ApotekaProizvodId}", stavkaDTO.Kolicina, proizvod.StanjeZaliha, stavkaDTO.ApotekaProizvodId);
                return BadRequest("Trenutno na stanju nema dovoljno trazenog proizvoda.");
            }

            stavkaDTO.Popust ??= 0;

            var stavka = _mapper.Map<StavkaPorudzbine>(stavkaDTO);

            await _unitOfWork.StavkaPorudzbine.CreateAsync(stavka);

            await _unitOfWork.Save();

            _logger.LogInformation("Successfully added stavka with id: {StavkaId} to porudzbina: {PorudzbinaId}", stavka.StavkaId, stavkaDTO.PorudzbinaId);
            return CreatedAtRoute("GetStavkaPorudzbine", new { id = stavka.StavkaId }, stavka);
        }

        /// <summary>
        /// Azurira stavku porudzbine. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpPut]
        public async Task<IActionResult> UpdateStavkaPorudzbine([FromBody] StavkaUpdateDto stavkaDTO)
        {
            _logger.LogInformation("Updating stavka porudzbine with id: {StavkaId}, new Kolicina: {Kolicina}", stavkaDTO.StavkaId, stavkaDTO.Kolicina);

            var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == stavkaDTO.StavkaId);

            if (stavka == null)
            {
                _logger.LogWarning("Stavka porudzbine with id {StavkaId} not found for update", stavkaDTO.StavkaId);
                return NotFound();
            }

            if (stavkaDTO.Kolicina <= 0)
            {
                _logger.LogWarning("Invalid quantity {Kolicina} for stavka update", stavkaDTO.Kolicina);
                return BadRequest("Kolicina mora biti veca od nule.");
            }

            //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
            ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == stavka.ApotekaProizvodId);

            if (stavkaDTO.Kolicina > proizvod.StanjeZaliha)
            {
                _logger.LogWarning("Requested quantity {Kolicina} exceeds stock {StanjeZaliha} for ApotekaProizvodId: {ApotekaProizvodId}", stavkaDTO.Kolicina, proizvod.StanjeZaliha, stavka.ApotekaProizvodId);
                return BadRequest("Trenutno na stanju nema dovoljno trazenog proizvoda.");
            }

            _mapper.Map(stavkaDTO, stavka);

            _unitOfWork.StavkaPorudzbine.UpdateAsync(stavka);

            await _unitOfWork.Save();

            _logger.LogInformation("Successfully updated stavka porudzbine with id: {StavkaId}", stavkaDTO.StavkaId);
            return Ok("Uspesna izmena.");
        }

        /// <summary>
        /// Brise stavku porudzbine na osnovu id-ja. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStavkaPorudzbine(int id)
        {
            _logger.LogInformation("Deleting stavka porudzbine with id: {Id}", id);

            var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == id);

            if (stavka == null)
            {
                _logger.LogWarning("Stavka porudzbine with id {Id} not found for deletion", id);
                return NotFound();
            }

            await _unitOfWork.StavkaPorudzbine.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Successfully deleted stavka porudzbine with id: {Id}", id);
            return NoContent();
        }
    }

  
}
