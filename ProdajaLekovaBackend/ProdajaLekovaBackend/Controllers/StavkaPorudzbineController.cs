using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Exceptions;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using System.Data;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/stavkaPorudzbine")]
    [ApiController]
    public class StavkaPorudzbineController : Controller
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
            var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == id);

            if (stavka == null)
                throw new NotFoundException("Stavka porudzbine", id);

            var result = _mapper.Map<StavkaDto>(stavka);

            return Ok(result);
        }

        /// <summary>
        /// Dodaje novu stavku u postojecu porudzbinu. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpPost]
        public async Task<IActionResult> AddStavkaToPorudzbina([FromBody] StavkaCreateDto stavkaDTO)
        {
            //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
            ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == stavkaDTO.ApotekaProizvodId);

            if (stavkaDTO.Kolicina > proizvod.StanjeZaliha)
                throw new BadRequestException("Trenutno na stanju nema dovoljno trazenog proizvoda.");

            stavkaDTO.Popust ??= 0;

            var stavka = _mapper.Map<StavkaPorudzbine>(stavkaDTO);

            await _unitOfWork.StavkaPorudzbine.CreateAsync(stavka);

            await _unitOfWork.Save();

            _logger.LogInformation("Created new StavkaPorudzbine with ID: {StavkaId}", stavka.StavkaId);

            return CreatedAtRoute("GetStavkaPorudzbine", new { id = stavka.StavkaId }, stavka);
        }

        /// <summary>
        /// Azurira stavku porudzbine. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpPut]
        public async Task<IActionResult> UpdateStavkaPorudzbine([FromBody] StavkaUpdateDto stavkaDTO)
        {
            var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == stavkaDTO.StavkaId);

            if (stavka == null)
                throw new NotFoundException("Stavka porudzbine", stavkaDTO.StavkaId);

            //provera da li trazena kolicina proizvoda premasuje stanje zaliha tog proizvoda
            ApotekaProizvod proizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == stavka.ApotekaProizvodId);

            if (stavkaDTO.Kolicina > proizvod.StanjeZaliha)
                throw new BadRequestException("Trenutno na stanju nema dovoljno trazenog proizvoda.");

            _mapper.Map(stavkaDTO, stavka);

            _unitOfWork.StavkaPorudzbine.UpdateAsync(stavka);

            await _unitOfWork.Save();

            _logger.LogInformation("Updated StavkaPorudzbine with ID: {StavkaId}", stavkaDTO.StavkaId);

            return Ok("Uspesna izmena.");
        }

        /// <summary>
        /// Brise stavku porudzbine na osnovu id-ja. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStavkaPorudzbine(int id)
        {
            var stavka = await _unitOfWork.StavkaPorudzbine.GetAsync(q => q.StavkaId == id);

            if (stavka == null)
                throw new NotFoundException("Stavka porudzbine", id);

            await _unitOfWork.StavkaPorudzbine.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Deleted StavkaPorudzbine with ID: {StavkaId}", id);

            return NoContent();
        }
    }
}
