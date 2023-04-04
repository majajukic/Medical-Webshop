using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Interfaces;

namespace ProdajaLekovaBackend.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApotekaDbContext _context;
        private IGenericRepository<Apoteka> _apoteka;
        private IGenericRepository<TipProizvoda> _tipproizvoda;
        private IGenericRepository<Proizvod> _proizvod;
        private IGenericRepository<ApotekaProizvod> _apotekaProizvod;
        private IGenericRepository<Korisnik> _korisnik;
        private IGenericRepository<Porudzbina> _porudzbina;
        private IGenericRepository<StavkaPorudzbine> _stavkaPorudzbine;

        public UnitOfWork(ApotekaDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<Apoteka> Apoteka => _apoteka ??= new GenericRepository<Apoteka>(_context);
        public IGenericRepository<TipProizvoda> TipProizvoda => _tipproizvoda ??= new GenericRepository<TipProizvoda>(_context);
        public IGenericRepository<Proizvod> Proizvod => _proizvod ??= new GenericRepository<Proizvod>(_context);
        public IGenericRepository<ApotekaProizvod> ApotekaProizvod => _apotekaProizvod ??= new GenericRepository<ApotekaProizvod>(_context);
        public IGenericRepository<Korisnik> Korisnik => _korisnik ??= new GenericRepository<Korisnik>(_context);
        public IGenericRepository<Porudzbina> Porudzbina => _porudzbina ??= new GenericRepository<Porudzbina>(_context);
        public IGenericRepository<StavkaPorudzbine> StavkaPorudzbine => _stavkaPorudzbine ??= new GenericRepository<StavkaPorudzbine>(_context);    

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
