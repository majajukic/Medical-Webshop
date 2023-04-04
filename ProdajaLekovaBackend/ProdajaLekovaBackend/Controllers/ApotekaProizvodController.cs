using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Controllers
{
    [Route("api/apotekaProizvod")]
    [ApiController]
    public class ApotekaProizvodController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ApotekaProizvodController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Vraća sve proizvode iz svih apoteka, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetApotekaProizvodi([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId, [FromQuery] string? searchTerm)
        {
            try
            {
                List<ApotekaProizvodDto> results;

                if (apotekaId == null)
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);
                }
                else
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        q => q.ApotekaId == apotekaId,
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);
                }

                if (string.IsNullOrEmpty(searchTerm))
                {
                    return Ok(results);
                }
                else
                {
                    var filteredResults = results.Where(q => q.Proizvod.NazivProizvoda.ToLower().Contains(searchTerm));

                    return Ok(filteredResults);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća sve proizvode svih apoteka na osnovu kategorije, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [HttpGet("byTipProizvoda")]
        public async Task<IActionResult> GetApotekaProizvodiByTipProizvoda([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId, [FromQuery] int tipProizvodaId)
        {
            try
            {
                List<ApotekaProizvodDto> results;

                if (apotekaId == null)
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        q => q.Proizvod.TipProizvodaId == tipProizvodaId, 
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);

                }
                else
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        q => q.ApotekaId == apotekaId && q.Proizvod.TipProizvodaId == tipProizvodaId, 
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);

                    
                }

                return Ok(results);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća sve proizvode svih apoteka koji su na popustu, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [HttpGet("naPopustu")]
        public async Task<IActionResult> GetApotekaProizvodiNaPopustu([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
        {
            try
            {
                List<ApotekaProizvodDto> results;

                if (apotekaId == null)
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        q => q.PopustUprocentima != null, 
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);

                }
                else
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        q => q.ApotekaId == apotekaId && q.PopustUprocentima != null, 
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);

                    
                }

                return Ok(results);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni rastuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [HttpGet("byCenaRastuce")]
        public async Task<IActionResult> GetApotekaProizvodiByCenaAscending([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
        {
            try
            {
                List<ApotekaProizvodDto> results;

                if (apotekaId == null)
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda), 
                        orderBy: q => q.OrderBy(x => x.CenaSaPopustom));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);

                }
                else
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams, 
                        q => q.ApotekaId == apotekaId, 
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda), 
                        orderBy: q => q.OrderBy(x => x.CenaSaPopustom));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);
                }

                return Ok(results);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni opadajuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [HttpGet("byCenaOpadajuce")]
        public async Task<IActionResult> GetApotekaProizvodiByCenaDescending([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
        {
            try
            {
                List<ApotekaProizvodDto> results;

                if (apotekaId == null)
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda), 
                        orderBy: q => q.OrderByDescending(x => x.CenaSaPopustom));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);

                }
                else
                {
                    var apotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllPagedListAsync(requestParams,
                        q => q.ApotekaId == apotekaId, 
                        include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda), 
                        orderBy: q => q.OrderByDescending(x => x.CenaSaPopustom));

                    if (apotekaProizvodi == null) return NoContent();

                    results = _mapper.Map<List<ApotekaProizvodDto>>(apotekaProizvodi);

                    return Ok(results);
                }

                return Ok(results);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća jedan proizvod konkretne apoteke na osnovu id-ja.
        /// </summary>
        [HttpGet("{id:int}", Name = "GetApotekaProizvod")]
        public async Task<IActionResult> GetApotekaProizvod(int id)
        {
            try
            {
                var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id, include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka));

                if (apotekaProizvod == null) return NotFound();

                var result = _mapper.Map<ApotekaProizvodDto>(apotekaProizvod);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Dodavanje postojeceg proizvoda u odredjenu apoteku. AKTIVIRA TRIGER
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateApotekaProizvod([FromBody] ApotekaProizvodCreateDto apotekaProizvodDTO)
        {

            try
            {
                var apotekaProizvod = _mapper.Map<ApotekaProizvod>(apotekaProizvodDTO);

                await _unitOfWork.ApotekaProizvod.CreateAsync(apotekaProizvod);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetApotekaProizvod", new { id = apotekaProizvod.ApotekaProizvodId }, apotekaProizvod);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Azuriranje atributa osobenih za proizvod u okviru odredjene apoteke na osnovu id-ja. AKTIVIRA TRIGER
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateApotekaProizvod([FromBody] ApotekaProizvodUpdateDto apotekaProizvodDTO)
        {

            try
            {
                var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == apotekaProizvodDTO.ApotekaProizvodId);

                if (apotekaProizvod == null) return NotFound();

                _mapper.Map(apotekaProizvodDTO, apotekaProizvod);

                _unitOfWork.ApotekaProizvod.UpdateAsync(apotekaProizvod);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Brise proizvod iz konkretne apoteke na osnovu id-ja.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApotekaProizvod(int id)
        {
            try
            {
                var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id);

                if (apotekaProizvod == null) return NotFound();

                await _unitOfWork.ApotekaProizvod.DeleteAsync(id);

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
