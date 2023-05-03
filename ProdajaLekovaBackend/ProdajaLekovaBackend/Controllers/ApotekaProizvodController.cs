using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
        [AllowAnonymous]
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
                    var allApotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllAsync(include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                    var allResults = _mapper.Map<List<ApotekaProizvodDto>>(allApotekaProizvodi);

                    var filteredResults = allResults.Where(q => q.Proizvod.NazivProizvoda.ToLower().Contains(searchTerm));

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
        [AllowAnonymous]
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
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća sve proizvode svih apoteka koji su na popustu, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
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
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni rastuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
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
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni opadajuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
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
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća jedan proizvod konkretne apoteke na osnovu id-ja.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{id:int}", Name = "GetApotekaProizvod")]
        public async Task<IActionResult> GetApotekaProizvod(int id)
        {
            try
            {
                var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id, include: q => q.Include(x => x.Proizvod.TipProizvoda).Include(x => x.Apoteka));

                if (apotekaProizvod == null) return NotFound("Proizvod nije pronadjen.");

                var result = _mapper.Map<ApotekaProizvodDto>(apotekaProizvod);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Dodavanje postojeceg proizvoda u odredjenu apoteku.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateApotekaProizvod([FromBody] ApotekaProizvodCreateDto apotekaProizvodDTO)
        {

            try
            {
                //dodavanje popusta na cenu proizvoda, ako popust nije null
                if(apotekaProizvodDTO.PopustUprocentima == null)
                {
                    apotekaProizvodDTO.CenaSaPopustom = apotekaProizvodDTO.CenaBezPopusta;
                } 
                else
                {
                    apotekaProizvodDTO.CenaSaPopustom = apotekaProizvodDTO.CenaBezPopusta - (apotekaProizvodDTO.CenaBezPopusta * apotekaProizvodDTO.PopustUprocentima / 100);
                }

                var apotekaProizvod = _mapper.Map<ApotekaProizvod>(apotekaProizvodDTO);

                await _unitOfWork.ApotekaProizvod.CreateAsync(apotekaProizvod);

                await _unitOfWork.Save();

                return CreatedAtRoute("GetApotekaProizvod", new { id = apotekaProizvod.ApotekaProizvodId }, apotekaProizvod);
            }
            catch (Exception)
            {

                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Azuriranje atributa osobenih za proizvod u okviru odredjene apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateApotekaProizvod([FromBody] ApotekaProizvodUpdateDto apotekaProizvodDTO)
        {

            try
            {
                var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == apotekaProizvodDTO.ApotekaProizvodId);

                if (apotekaProizvod == null) return NotFound("Proizvod nije pronadjen");

                //dodavanje popusta na cenu proizvoda, ako popust nije null prilikom izmene
                if (apotekaProizvodDTO.PopustUprocentima == null)
                {
                    apotekaProizvodDTO.CenaSaPopustom = apotekaProizvodDTO.CenaBezPopusta;
                }
                else
                {
                    apotekaProizvodDTO.CenaSaPopustom = apotekaProizvodDTO.CenaBezPopusta - (apotekaProizvodDTO.CenaBezPopusta * apotekaProizvodDTO.PopustUprocentima / 100);
                }

                _mapper.Map(apotekaProizvodDTO, apotekaProizvod);

                _unitOfWork.ApotekaProizvod.UpdateAsync(apotekaProizvod);

                await _unitOfWork.Save();

                return Ok("Uspesna izmena.");
            }
            catch (Exception)
            {

                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Brise proizvod iz konkretne apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApotekaProizvod(int id)
        {
            try
            {
                var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id);

                if (apotekaProizvod == null) return NotFound("Proizvod nije pronadjen.");

                await _unitOfWork.ApotekaProizvod.DeleteAsync(id);

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
