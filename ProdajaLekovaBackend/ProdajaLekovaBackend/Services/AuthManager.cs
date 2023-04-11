using Microsoft.IdentityModel.Tokens;
using ProdajaLekovaBackend.DTOs.KorisnikDTOs;
using ProdajaLekovaBackend.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProdajaLekovaBackend.Services
{
    public class AuthManager : IAuthManager
    {
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public AuthManager(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;
        }

        public async Task<string> CreateToken(KorisnikLoginDto korisnikDTO)
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims(korisnikDTO);
            var token = GenerateTokenOptions(signingCredentials, claims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var token = new JwtSecurityToken(
                issuer: jwtSettings.GetSection("Issuer").Value,
                audience: jwtSettings.GetSection("Audience").Value,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: signingCredentials
                );

            return token;
        }

        private async Task <List<Claim>>GetClaims(KorisnikLoginDto korisnikDTO)
        {
            var claims = new List<Claim>();

            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.Email == korisnikDTO.Email);

            claims.Add(new Claim(ClaimTypes.Role, korisnik.TipKorisnika.ToString()));

            claims.Add(new Claim("Id", korisnik.KorisnikId.ToString()));

            return claims;
        }

        private static SigningCredentials GetSigningCredentials()
        {
            var key = Environment.GetEnvironmentVariable("KEY", EnvironmentVariableTarget.Machine);

            var secret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        public async Task<bool> ValidateKorisnik(KorisnikLoginDto korisnikDTO)
        {
            var korisnik = await _unitOfWork.Korisnik.GetAsync(q => q.Email == korisnikDTO.Email);

            if (korisnik == null) return false;

            if (!BCrypt.Net.BCrypt.Verify(korisnikDTO.Lozinka, korisnik.Lozinka)) return false;

            return true;
        }

    }
}
