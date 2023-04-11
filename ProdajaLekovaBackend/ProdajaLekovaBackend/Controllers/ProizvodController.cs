using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.ProizvodDTOs;
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

        public ProizvodController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Vraća sve proizvode (naziv, proizvodjaca i tip).
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetProizvodi()
        {
            try
            {
                var proizvodi = await _unitOfWork.Proizvod.GetAllAsync(include: q => q.Include(x => x.TipProizvoda), 
                    orderBy: q => q.OrderBy(x => x.NazivProizvoda));

                if (proizvodi == null) return NoContent();

                var results = _mapper.Map<List<ProizvodDto>>(proizvodi);

                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća jedan proizvod na osnovu id-ja (naziv, proizvodjaca i tip).
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}", Name = "GetProizvod")]
        public async Task<IActionResult> GetProizvod(int id)
        {
            try
            {
                var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == id, 
                    include: q => q.Include(x => x.TipProizvoda));

                if (proizvod == null) return NotFound("Proizvod nije pronadjen.");

                var result = _mapper.Map<ProizvodDto>(proizvod);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Kreiranje proizvoda. 
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProizvod([FromBody] ProizvodCreateDto proizvodDTO)
        {
            try
            { 

                var proizvod = _mapper.Map<Proizvod>(proizvodDTO);

                await _unitOfWork.Proizvod.CreateAsync(proizvod);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetProizvod", new { id = proizvod.ProizvodId }, proizvod);
 
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Azuriranje naziva proizvod, tipa i proizvodjaca za sve apoteke na osnovu id-ja. 
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateProizvod([FromBody] ProizvodUpdateDto proizvodDTO)
        {

            try
            {
                var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == proizvodDTO.ProizvodId);

                if (proizvod == null) return NotFound("Proizvod nije pronadjen");

                _mapper.Map(proizvodDTO, proizvod);

                _unitOfWork.Proizvod.UpdateAsync(proizvod);

                await _unitOfWork.Save();

                return Ok("Uspesna izmena.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Brise proizvod iz svih apoteka u kojima se nalazi na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProizvod(int id)
        {
            try
            {
                var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == id);

                if (proizvod == null) return NotFound("Proizvod nije pronadjen.");

                await _unitOfWork.Proizvod.DeleteAsync(id);

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
