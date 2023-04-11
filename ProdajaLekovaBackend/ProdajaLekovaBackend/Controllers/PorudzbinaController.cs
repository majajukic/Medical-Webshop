using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;
using System.Data;
using System.Security.Claims;

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
        [Authorize(Roles = "Admin")]
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
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća placene porudzbine.
        /// </summary>
        [Authorize(Roles = "Admin")]
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
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća neplacene porudzbine.
        /// </summary>
        [Authorize(Roles = "Admin")]
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
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća sve porudzbine jednog kupca.
        /// </summary>
        [Authorize(Roles = "Admin, Kupac")]
        [HttpGet("porudzbineByKupac/{id:int}")]
        public async Task<IActionResult> GetPorudzbineByKupac([FromQuery] RequestParams requestParams, int id)
        {
            try
            {
                var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

                var role = User.Claims.First(x => x.Type == ClaimTypes.Role).Value;

                if (korisnikId != id && !role.Equals("Admin")) return Unauthorized("Nemate prava na ovu akciju.");

                var porudzbine = await _unitOfWork.Porudzbina.GetAllPagedListAsync(requestParams, q => q.KorisnikId == id);

                if (porudzbine == null) return NoContent();

                var results = _mapper.Map<List<PorudzbinaDto>>(porudzbine);

                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Vraća jednu porudzbinu na osnovu id-ja (sadrzaj korpe).
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpGet("{porudzbinaId:int}", Name = "GetPorudzbina")]
        public async Task<IActionResult> GetPorudzbina(int porudzbinaId, [FromQuery] int kupacId)
        {
            try
            {
                var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

                if (korisnikId != kupacId) return Unauthorized("Nemate prava na ovu akciju.");

                var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaId && q.Korisnik.KorisnikId == kupacId,
                    include: q => q.Include(x => x.StavkaPorudzbine).ThenInclude(y => y.ApotekaProizvod).ThenInclude(z => z.Proizvod.TipProizvoda));

                if (porudzbina == null) return NotFound("Porudzbina nije pronadjena.");

                var result = _mapper.Map<PorudzbinaDto>(porudzbina);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Kreira porudzbinu zajedno sa prvom stavkom koja se dodaje u korpu.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpPost]
        public async Task<IActionResult> CreatePorudzbinaWithStavka([FromBody] JoinedCreateDto joinedDataDTO)
        {
            try
            {
                var korisnikId = int.Parse(User.FindFirst("Id")?.Value);

                Random rnd = new();
                int brojPorudzbine = rnd.Next(10000, 99999);
                joinedDataDTO.BrojPorudzbine = "#" + brojPorudzbine.ToString();

                joinedDataDTO.DatumKreiranja = DateTime.Now;

                joinedDataDTO.PlacenaPorudzbina = false;

                if(joinedDataDTO.Popust == null)
                {
                    joinedDataDTO.Popust = 0;
                }

                PorudzbinaCreateDto porudzbinaDTO = new PorudzbinaCreateDto
                {
                    BrojPorudzbine = joinedDataDTO.BrojPorudzbine,
                    DatumKreiranja = (DateTime)joinedDataDTO.DatumKreiranja,
                    UkupanIznos = joinedDataDTO.UkupanIznos,
                    PlacenaPorudzbina = (bool)joinedDataDTO.PlacenaPorudzbina,
                    DatumPlacanja = joinedDataDTO.DatumPlacanja,
                    UplataId = joinedDataDTO.UplataId,
                    KorisnikId = korisnikId
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

                return CreatedAtRoute("GetPorudzbina", new { porudzbinaId = porudzbina.PorudzbinaId }, porudzbina);
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }


        /// <summary>
        /// Azurira porudzbinu nakon uplate. AKTIVIRA TRIGER
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpPut]
        public async Task<IActionResult> UpdatePorudzbina([FromBody] PorudzbinaUpdateDto porudzbinaDTO)
        {

            try
            {
                var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == porudzbinaDTO.PorudzbinaId);

                if (porudzbina == null) return NotFound("Porudzbina nije pronadjena.");

                porudzbinaDTO.DatumPlacanja = DateTime.Now;

                porudzbinaDTO.PlacenaPorudzbina = true;

                _mapper.Map(porudzbinaDTO, porudzbina);

                _unitOfWork.Porudzbina.UpdateAsync(porudzbina);

                await _unitOfWork.Save();

                return Ok("Uspesna izmena.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Serverska greska.");
            }
        }

        /// <summary>
        /// Brise porudzbinu i sve njene stavke na osnovu id-ja porudzbine.
        /// </summary>
        [Authorize(Roles = "Kupac")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePorudzbina(int id)
        {
            try
            {
                var porudzbina = await _unitOfWork.Porudzbina.GetAsync(q => q.PorudzbinaId == id);

                if (porudzbina == null) return NotFound("Porudzbina nije pronadjena.");

                await _unitOfWork.Porudzbina.DeleteAsync(id);

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
