using AutoMapper;
using ProdajaLekovaBackend.DTOs.ApotekaDTOs;
using ProdajaLekovaBackend.DTOs.ApotekaProizvodDTOs;
using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.DTOs.PorudzbinaDTOs;
using ProdajaLekovaBackend.DTOs.ProizvodDTOs;
using ProdajaLekovaBackend.DTOs.StavkaPorudzbineDTOs;
using ProdajaLekovaBackend.DTOs.TipProizvodaDTOs;
using ProdajaLekovaBackend.Models;

namespace ProdajaLekovaBackend.Configurations
{
    public class MapperInitializer : Profile
    {
        public MapperInitializer()
        {
            
            //Mapiranja za entitet TipProizvoda
            CreateMap<TipProizvoda, TipProizvodaDto>().ReverseMap();
            CreateMap<TipProizvoda, TipProizvodaCreateDto>().ReverseMap();
            CreateMap<TipProizvoda, TipProizvodaUpdateDto>().ReverseMap();

            //Mapiranja za entitet Apoteka
            CreateMap<Apoteka, ApotekaDto>().ReverseMap();
            CreateMap<Apoteka, ApotekaCreateDto>().ReverseMap();
            CreateMap<Apoteka, ApotekaUpdateDto>().ReverseMap();

            //Mapiranja za entitet ApotekaProizvod
            CreateMap<ApotekaProizvod, ApotekaProizvodDto>().ReverseMap();
            CreateMap<ApotekaProizvod, ApotekaProizvodCreateDto>().ReverseMap();
            CreateMap<ApotekaProizvod, ApotekaProizvodUpdateDto>().ReverseMap();

            //Mapiranja za entitet Proizvod
            CreateMap<Proizvod, ProizvodDto>().ReverseMap();
            CreateMap<Proizvod, ProizvodCreateDto>().ReverseMap();
            CreateMap<Proizvod, ProizvodUpdateDto>().ReverseMap();

            //Mapiranja za entitet Korisnik
            CreateMap<Korisnik, KorisnikDto>().ReverseMap();
            CreateMap<Korisnik, KorisnikCreateDto>().ReverseMap();
            CreateMap<Korisnik, KorisnikUpdateDto>().ReverseMap();

            //Mapiranja za entitet Porudzbina
            CreateMap<Porudzbina, PorudzbinaCreateDto>().ReverseMap();
            CreateMap<Porudzbina, PorudzbinaDto>().ReverseMap();
            CreateMap<Porudzbina, PorudzbinaUpdateDto>().ReverseMap();

            //Mapiranja za entitet StavkaPorudzbine
            CreateMap<StavkaPorudzbine, StavkaCreateDto>().ReverseMap();
            CreateMap<StavkaPorudzbine, StavkaDto>().ReverseMap();
            CreateMap<StavkaPorudzbine, StavkaUpdateDto>().ReverseMap();
        }
    }
}
