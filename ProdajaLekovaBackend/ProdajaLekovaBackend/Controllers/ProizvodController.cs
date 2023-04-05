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
        /// Vraća sve proizvode (naziv i proizvodjaca).
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetProizvodi()
        {
            try
            {
                var proizvodi = await _unitOfWork.Proizvod.GetAllAsync(include: q => q.Include(x => x.TipProizvoda).Include(x => x.ApotekaProizvod),
                    orderBy: q => q.OrderBy(x => x.NazivProizvoda)); //kako bi se proizvodi izlistali od A-Z

                if (proizvodi == null) return NoContent();

                var results = _mapper.Map<List<ProizvodDto>>(proizvodi);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća jedan proizvod na osnovu id-ja (naziv i proizvodjaca).
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{id:int}", Name = "GetProizvod")]
        public async Task<IActionResult> GetProizvod(int id)
        {
            try
            {
                var proizvod = await _unitOfWork.Proizvod.GetAsync(q => q.ProizvodId == id, include: q => q.Include(x => x.TipProizvoda).Include(x => x.ApotekaProizvod));

                if (proizvod == null) return NotFound();

                var result = _mapper.Map<ProizvodDto>(proizvod);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Kreiranje proizvoda koji ce nakon toga biti dodat u konkretnu apoteku. 
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
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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

                if (proizvod == null) return NotFound();

                _mapper.Map(proizvodDTO, proizvod);

                _unitOfWork.Proizvod.UpdateAsync(proizvod);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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

                if (proizvod == null) return NotFound();

                await _unitOfWork.Proizvod.DeleteAsync(id);

                await _unitOfWork.Save();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
