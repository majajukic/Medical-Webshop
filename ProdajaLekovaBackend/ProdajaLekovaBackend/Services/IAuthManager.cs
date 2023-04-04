using ProdajaLekovaBackend.DTOs.KorisnikDTOs;

namespace ProdajaLekovaBackend.Services
{
    public interface IAuthManager
    {
        Task<bool> ValidateKorisnik(KorisnikLoginDto korisnikDTO);
        Task<string> CreateToken(KorisnikLoginDto korisnikDTO);
    }
}
