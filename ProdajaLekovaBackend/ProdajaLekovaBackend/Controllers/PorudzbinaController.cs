using AutoMapper;
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

        public PorudzbinaController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Vraća sve porudzbine.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetPorudzbine([FromQuery] RequestParams requestParams)
        {
            try
            {
                var porudzbine = await _unitOfWork.Porudzbina.GetAllPagedListAsync(requestParams,
                    orderBy: q => q.OrderByDescending(x => x.DatumKreiranja));

                if (porudzbine == null) return NoContent();

                var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća placene porudzbine.
        /// </summary>
        [HttpGet("placene")]
        public async Task<IActionResult> GetPayedPorudzbine([FromQuery] RequestParams requestParams)
        {
            try
            {
                var porudzbine = await _unitOfWork.Porudzbina.GetAllPagedListAsync(requestParams, 
                    q => q.PlacenaPorudzbina == true, 
                    orderBy: q => q.OrderByDescending(x => x.DatumKreiranja));

                if (porudzbine == null) return NoContent();

                var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća neplacene porudzbine.
        /// </summary>
        [HttpGet("neplacene")]
        public async Task<IActionResult> GetNonPayedPorudzbine([FromQuery] RequestParams requestParams)
        {
            try
            {
                var porudzbine = await _unitOfWork.Porudzbina.GetAllPagedListAsync(requestParams, 
                    q => q.PlacenaPorudzbina == false,
                    orderBy: q => q.OrderByDescending(x => x.DatumKreiranja));

                if (porudzbine == null) return NoContent();

                var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća sve porudzbine jednog kupca.
        /// </summary>
        [HttpGet("porudzbineByKupac")]
        public async Task<IActionResult> GetPorudzbineByKupac([FromQuery] RequestParams requestParams, [FromQuery] int kupacId)
        {
            try
            {
                var porudzbine = await _unitOfWork.Porudzbina.GetAllPagedListAsync(requestParams, 
                    q => q.KorisnikId == kupacId, 
                    orderBy: q => q.OrderByDescending(x => x.DatumKreiranja));

                if (porudzbine == null) return NoContent();

                var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Vraća jednu porudzbinu na osnovu id-ja.
        /// </summary>
        [HttpGet("{id:int}", Name = "GetPorudzbina")]
        public async Task<IActionResult> GetPorudzbina(int id)
        {
            try
            {
                var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == id,
                    include: q => q.Include(x => x.StavkaPorudzbine).Include(x => x.Korisnik));

                if (porudzbina == null) return NotFound();

                var result = _mapper.Map<PorudzbinaDto>(porudzbina);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Kreira porudzbinu zajedno sa prvom stavkom koja se dodaje u korpu.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreatePorudzbinaWithStavka([FromBody] JoinedCreateDto joinedDataDTO)
        {
            try
            {
                Random rnd = new();
                int brojPorudzbine = rnd.Next(10000, 99999);
                joinedDataDTO.BrojPorudzbine = "#" + brojPorudzbine.ToString();

                joinedDataDTO.DatumKreiranja = DateTime.Now;

                joinedDataDTO.PlacenaPorudzbina = false;

                PorudzbinaCreateDto porudzbinaDTO = new PorudzbinaCreateDto
                {
                    BrojPorudzbine = joinedDataDTO.BrojPorudzbine,
                    DatumKreiranja = (DateTime)joinedDataDTO.DatumKreiranja,
                    UkupanIznos = joinedDataDTO.UkupanIznos,
                    PlacenaPorudzbina = (bool)joinedDataDTO.PlacenaPorudzbina,
                    DatumPlacanja = joinedDataDTO.DatumPlacanja,
                    UplataId = joinedDataDTO.UplataId,
                    KorisnikId = joinedDataDTO.KorisnikId
                };

                var porudzbina = _mapper.Map<Porudzbina>(porudzbinaDTO);

                await _unitOfWork.Porudzbina.CreateAsync(porudzbina);

                await _unitOfWork.Save();

                int porudzbinaIdKreirani = porudzbina.PorudzbinaId;

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

                return CreatedAtRoute("GetPorudzbina", new { id = porudzbina.PorudzbinaId }, porudzbina);
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }


        /// <summary>
        /// Azurira porudzbinu nakon uplate. AKTIVIRA TRIGER
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdatePorudzbina([FromBody] PorudzbinaUpdateDto porudzbinaDTO)
        {

            try
            {
                var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaDTO.PorudzbinaId);

                if (porudzbina == null) return NotFound();

                porudzbinaDTO.DatumPlacanja = DateTime.Now;

                _mapper.Map(porudzbinaDTO, porudzbina);

                _unitOfWork.Porudzbina.UpdateAsync(porudzbina);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Brise porudzbinu i sve njene stavke na osnovu id-ja porudzbine.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePorudzbina(int id)
        {
            try
            {
                var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == id);

                if (porudzbina == null) return NotFound();

                await _unitOfWork.Porudzbina.DeleteAsync(id);

                await _unitOfWork.Save();

                return NoContent();
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }
    }
}
