using ProdajaLekovaBackend.Models;

namespace ProdajaLekovaBackend.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Apoteka> Apoteka { get; }
        IGenericRepository<TipProizvoda> TipProizvoda { get; }
        IGenericRepository<Proizvod> Proizvod { get; }
        IGenericRepository<ApotekaProizvod> ApotekaProizvod { get; }
        IGenericRepository<Korisnik> Korisnik { get; }
        IGenericRepository<Porudzbina> Porudzbina { get; }
        IGenericRepository<StavkaPorudzbine> StavkaPorudzbine { get; }
        Task Save();
    }
}
