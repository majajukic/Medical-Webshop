using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.ProizvodDTOs;
using ProdajaLekovaBackend.Exceptions;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/proizvod")]
    [ApiController]
    public class ProizvodController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ProizvodController> _logger;

        public ProizvodController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ProizvodController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća sve proizvode (naziv, proizvodjaca i tip).
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetProizvodi()
        {
            var proizvodi = await _unitOfWork.Proizvod.GetAllAsync(include: q => q.Include(x => x.TipProizvoda),
                orderBy: q => q.OrderBy(x => x.NazivProizvoda));

            if (proizvodi == null) return NoContent();

            var results = _mapper.Map<List<ProizvodDto>>(proizvodi);

            return Ok(results);
        }

        /// <summary>
        /// Vraća jedan proizvod na osnovu id-ja (naziv, proizvodjaca i tip).
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetProizvod")]
        public async Task<IActionResult> GetProizvod(int id)
        {
            var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == id,
                include: q => q.Include(x => x.TipProizvoda));

            if (proizvod == null)
                throw new NotFoundException("Proizvod", id);

            var result = _mapper.Map<ProizvodDto>(proizvod);

            return Ok(result);
        }

        /// <summary>
        /// Kreiranje proizvoda.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProizvod([FromBody] ProizvodCreateDto proizvodDTO)
        {
            var proizvod = _mapper.Map<Proizvod>(proizvodDTO);

            await _unitOfWork.Proizvod.CreateAsync(proizvod);

            await _unitOfWork.Save();

            _logger.LogInformation("Created new Proizvod with ID: {ProizvodId}", proizvod.ProizvodId);

            return CreatedAtRoute("GetProizvod", new { id = proizvod.ProizvodId }, proizvod);
        }

        /// <summary>
        /// Azuriranje naziva proizvod, tipa i proizvodjaca za sve apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateProizvod([FromBody] ProizvodUpdateDto proizvodDTO)
        {
            var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == proizvodDTO.ProizvodId);

            if (proizvod == null)
                throw new NotFoundException("Proizvod", proizvodDTO.ProizvodId);

            _mapper.Map(proizvodDTO, proizvod);

            _unitOfWork.Proizvod.UpdateAsync(proizvod);

            await _unitOfWork.Save();

            _logger.LogInformation("Updated Proizvod with ID: {ProizvodId}", proizvodDTO.ProizvodId);

            return Ok("Uspesna izmena.");
        }

        /// <summary>
        /// Brise proizvod iz svih apoteka u kojima se nalazi na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProizvod(int id)
        {
            var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == id);

            if (proizvod == null)
                throw new NotFoundException("Proizvod", id);

            await _unitOfWork.Proizvod.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Deleted Proizvod with ID: {ProizvodId}", id);

            return NoContent();
        }
    }
}
