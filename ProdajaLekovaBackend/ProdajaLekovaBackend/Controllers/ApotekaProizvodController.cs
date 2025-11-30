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
    public class ApotekaProizvodController : ControllerBase
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
            _logger.LogInformation("Fetching apoteka proizvodi with params: ApotekaId={ApotekaId}, SearchTerm={SearchTerm}", apotekaId, searchTerm);

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
                _logger.LogInformation("Successfully retrieved {Count} apoteka proizvodi", results.Count);
                return Ok(results);
            }
            else
            {
                var allApotekaProizvodi = await _unitOfWork.ApotekaProizvod.GetAllAsync(include: q => q.Include(x => x.Proizvod).Include(x => x.Apoteka).Include(x => x.Proizvod.TipProizvoda));

                var allResults = _mapper.Map<List<ApotekaProizvodDto>>(allApotekaProizvodi);

                var filteredResults = allResults.Where(q => q.Proizvod.NazivProizvoda.ToLower().Contains(searchTerm)).ToList();

                _logger.LogInformation("Successfully retrieved {Count} filtered apoteka proizvodi for search term: {SearchTerm}", filteredResults.Count, searchTerm);
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
            _logger.LogInformation("Fetching apoteka proizvodi by tip: ApotekaId={ApotekaId}, TipProizvodaId={TipProizvodaId}", apotekaId, tipProizvodaId);

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

            _logger.LogInformation("Successfully retrieved {Count} apoteka proizvodi by tip", results.Count);
            return Ok(results);
        }

        /// <summary>
        /// Vraća sve proizvode svih apoteka koji su na popustu, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("naPopustu")]
        public async Task<IActionResult> GetApotekaProizvodiNaPopustu([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
        {
            _logger.LogInformation("Fetching apoteka proizvodi na popustu: ApotekaId={ApotekaId}", apotekaId);

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

            _logger.LogInformation("Successfully retrieved {Count} apoteka proizvodi na popustu", results.Count);
            return Ok(results);
        }

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni rastuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("byCenaRastuce")]
        public async Task<IActionResult> GetApotekaProizvodiByCenaAscending([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
        {
            _logger.LogInformation("Fetching apoteka proizvodi sorted by cena ascending: ApotekaId={ApotekaId}", apotekaId);

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

            _logger.LogInformation("Successfully retrieved {Count} apoteka proizvodi sorted by cena ascending", results.Count);
            return Ok(results);
        }

        /// <summary>
        /// Sortira sve proizvode svih apoteka po ceni opadajuce, ukoliko nije prosledjen id konkretne apoteke.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("byCenaOpadajuce")]
        public async Task<IActionResult> GetApotekaProizvodiByCenaDescending([FromQuery] RequestParams requestParams, [FromQuery] int? apotekaId)
        {
            _logger.LogInformation("Fetching apoteka proizvodi sorted by cena descending: ApotekaId={ApotekaId}", apotekaId);

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
            }

            _logger.LogInformation("Successfully retrieved {Count} apoteka proizvodi sorted by cena descending", results.Count);
            return Ok(results);
        }

        /// <summary>
        /// Vraća jedan proizvod konkretne apoteke na osnovu id-ja.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{id:int}", Name = "GetApotekaProizvod")]
        public async Task<IActionResult> GetApotekaProizvod(int id)
        {
            _logger.LogInformation("Fetching apoteka proizvod with id: {Id}", id);

            var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id, include: q => q.Include(x => x.Proizvod.TipProizvoda).Include(x => x.Apoteka));

            if (apotekaProizvod == null)
            {
                _logger.LogWarning("Apoteka proizvod with id {Id} not found", id);
                return NotFound("Proizvod nije pronadjen.");
            }

            var result = _mapper.Map<ApotekaProizvodDto>(apotekaProizvod);

            _logger.LogInformation("Successfully retrieved apoteka proizvod with id: {Id}", id);
            return Ok(result);
        }

        /// <summary>
        /// Dodavanje postojeceg proizvoda u odredjenu apoteku.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateApotekaProizvod([FromBody] ApotekaProizvodCreateDto apotekaProizvodDTO)
        {
            _logger.LogInformation("Creating new apoteka proizvod for ApotekaId={ApotekaId}, ProizvodId={ProizvodId}", apotekaProizvodDTO.ApotekaId, apotekaProizvodDTO.ProizvodId);

            //dodavanje popusta na cenu proizvoda, ako popust nije null
            if (apotekaProizvodDTO.PopustUprocentima == null)
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

            _logger.LogInformation("Successfully created apoteka proizvod with id: {Id}", apotekaProizvod.ApotekaProizvodId);
            return CreatedAtRoute("GetApotekaProizvod", new { id = apotekaProizvod.ApotekaProizvodId }, apotekaProizvod);
        }

        /// <summary>
        /// Azuriranje atributa osobenih za proizvod u okviru odredjene apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateApotekaProizvod([FromBody] ApotekaProizvodUpdateDto apotekaProizvodDTO)
        {
            _logger.LogInformation("Updating apoteka proizvod with id: {Id}", apotekaProizvodDTO.ApotekaProizvodId);

            var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == apotekaProizvodDTO.ApotekaProizvodId);

            if (apotekaProizvod == null)
            {
                _logger.LogWarning("Apoteka proizvod with id {Id} not found for update", apotekaProizvodDTO.ApotekaProizvodId);
                return NotFound("Proizvod nije pronadjen");
            }

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

            _logger.LogInformation("Successfully updated apoteka proizvod with id: {Id}", apotekaProizvodDTO.ApotekaProizvodId);
            return Ok("Uspesna izmena.");
        }

        /// <summary>
        /// Brise proizvod iz konkretne apoteke na osnovu id-ja.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApotekaProizvod(int id)
        {
            _logger.LogInformation("Deleting apoteka proizvod with id: {Id}", id);

            var apotekaProizvod = await _unitOfWork.ApotekaProizvod.GetAsync(q => q.ApotekaProizvodId == id);

            if (apotekaProizvod == null)
            {
                _logger.LogWarning("Apoteka proizvod with id {Id} not found for deletion", id);
                return NotFound("Proizvod nije pronadjen.");
            }

            await _unitOfWork.ApotekaProizvod.DeleteAsync(id);

            await _unitOfWork.Save();

            _logger.LogInformation("Successfully deleted apoteka proizvod with id: {Id}", id);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvoda")]
        public async Task<IActionResult> GetTotalApotekaProizvod([FromQuery] int? apotekaId)
        {
            _logger.LogInformation("Fetching total count of apoteka proizvodi: ApotekaId={ApotekaId}", apotekaId);

            int total;

            if (apotekaId == null)
            {
                total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync();
            }
            else
            {
                total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.ApotekaId == apotekaId);
            }

            _logger.LogInformation("Total count of apoteka proizvodi: {Total}", total);
            return Ok(total);
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvodaPoTipu")]
        public async Task<IActionResult> GetTotalApotekaProizvodByTip([FromQuery] int tipProizvodaId)
        {
            _logger.LogInformation("Fetching total count of apoteka proizvodi by tip: TipProizvodaId={TipProizvodaId}", tipProizvodaId);

            int total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.Proizvod.TipProizvodaId == tipProizvodaId);

            _logger.LogInformation("Total count of apoteka proizvodi by tip: {Total}", total);
            return Ok(total);
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvodaNaPopustu")]
        public async Task<IActionResult> GetTotalApotekaProizvodNaPopustu()
        {
            _logger.LogInformation("Fetching total count of apoteka proizvodi na popustu");

            int total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.PopustUprocentima != null);

            _logger.LogInformation("Total count of apoteka proizvodi na popustu: {Total}", total);
            return Ok(total);
        }

        [AllowAnonymous]
        [HttpGet("ukupnoProizvodaPretraga")]
        public async Task<IActionResult> GetTotalApotekaProizvodPretraga([FromQuery] string searchTerm)
        {
            _logger.LogInformation("Fetching total count of apoteka proizvodi for search term: {SearchTerm}", searchTerm);

            int total = await _unitOfWork.ApotekaProizvod.GetTotalCountAsync(q => q.Proizvod.NazivProizvoda.ToLower().Contains(searchTerm));

            _logger.LogInformation("Total count of apoteka proizvodi for search term: {Total}", total);
            return Ok(total);
        }

    }
}
