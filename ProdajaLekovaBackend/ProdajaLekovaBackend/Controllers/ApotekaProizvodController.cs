using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs;
using ProdajaLekovaBackend.Exceptions;
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
        private readonly ILogger<ApotekaProizvodController> _logger;

        public ApotekaProizvodController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ApotekaProizvodController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Vraća sve proizvode iz svih apoteka, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetApotekaProizvodi([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId, [FromQuery] string? searchTerm)
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

        /// <summary>
        /// Vraća sve proizvode svih apoteka na osnovu kategorije, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("byTipProizvoda")]
        public async Task<IActionResult> GetApotekaProizvodiByTipProizvoda([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId, [FromQuery] int tipProizvodaId)
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

        /// <summary>
        /// Vraća sve proizvode svih apoteka koji su na popustu, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("naPopustu")]
        public async Task<IActionResult> GetApotekaProizvodiNaPopustu([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
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

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni rastuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("byCenaRastuce")]
        public async Task<IActionResult> GetApotekaProizvodiByCenaAscending([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
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

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni opadajuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("byCenaOpadajuce")]
        public async Task<IActionResult> GetApotekaProizvodiByCenaDescending([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
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

        /// <summary>
        /// Vraća jedan proizvod konkretne apoteke na osnovu id-ja.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{id:int}", Name = "GetApotekaProizvod")]
        public async Task<IActionResult> GetApotekaProizvod(int id)
        {
            var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id, include: q => q.Include(x => x.Proizvod.TipProizvoda).Include(x => x.Apoteka));

            if (apotekaProizvod == null) throw new NotFoundException("ApotekaProizvod", id);

            var result = _mapper.Map<ApotekaProizvodDto>(apotekaProizvod);

            return Ok(result);
        }

        /// <summary>
        /// Dodavanje postojeceg proizvoda u odredjenu apoteku.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateApotekaProizvod([FromBody] ApotekaProizvodCreateDto apotekaProizvodDTO)
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

            _logger.LogInformation("Kreiran novi proizvod u apoteci sa ID-jem: {ApotekaProizvodId}", apotekaProizvod.ApotekaProizvodId);

            return CreatedAtRoute("GetApotekaProizvod", new { id = apotekaProizvod.ApotekaProizvodId }, apotekaProizvod);
        }

        /// <summary>
        /// Azuriranje atributa osobenih za proizvod u okviru odredjene apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateApotekaProizvod([FromBody] ApotekaProizvodUpdateDto apotekaProizvodDTO)
        {
            var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == apotekaProizvodDTO.ApotekaProizvodId);

            if (apotekaProizvod == null) throw new NotFoundException("ApotekaProizvod", apotekaProizvodDTO.ApotekaProizvodId);

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

            _logger.LogInformation("Azuriran proizvod u apoteci sa ID-jem: {ApotekaProizvodId}", apotekaProizvod.ApotekaProizvodId);

            return Ok("Uspesna izmena.");
        }

        /// <summary>
        /// Brise proizvod iz konkretne apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApotekaProizvod(int id)
        {
            var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id);

            if (apotekaProizvod == null) throw new NotFoundException("ApotekaProizvod", id);

            await _unitOfWork.ApotekaProizvod.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Obrisan proizvod iz apoteke sa ID-jem: {ApotekaProizvodId}", id);

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvoda")]
        public async Task<IActionResult> GetTotalApotekaProizvod([FromQuery] int? apotekaId)
        {
            int total;

            if (apotekaId == null)
            {
                total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync();
            } else
            {
                total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.ApotekaId == apotekaId);
            }

            return Ok(total);
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvodaPoTipu")]
        public async Task<IActionResult> GetTotalApotekaProizvodByTip([FromQuery] int tipProizvodaId)
        {
            int total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.Proizvod.TipProizvodaId == tipProizvodaId);

            return Ok(total);
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvodaNaPopustu")]
        public async Task<IActionResult> GetTotalApotekaProizvodNaPopustu()
        {
            int total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.PopustUprocentima != null);

            return Ok(total);
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvodaPretraga")]
        public async Task<IActionResult> GetTotalApotekaProizvodPretraga([FromQuery] string searchTerm)
        {
            int total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.Proizvod.NazivProizvoda.ToLower().Contains(searchTerm));

            return Ok(total);
        }

    }
}
