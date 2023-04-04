using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ProdajaLekovaBackend.Models
{
    public partial class ApotekaDbContext : DbContext
    {
        public ApotekaDbContext()
        {
        }

        public ApotekaDbContext(DbContextOptions<ApotekaDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Apoteka> Apoteka { get; set; } = null!;
        public virtual DbSet<ApotekaProizvod> ApotekaProizvod { get; set; } = null!;
        public virtual DbSet<Korisnik> Korisnik { get; set; } = null!;
        public virtual DbSet<Porudzbina> Porudzbina { get; set; } = null!;
        public virtual DbSet<Proizvod> Proizvod { get; set; } = null!;
        public virtual DbSet<StavkaPorudzbine> StavkaPorudzbine { get; set; } = null!;
        public virtual DbSet<TipProizvoda> TipProizvoda { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Apoteka>(entity =>
            {
                entity.ToTable("Apoteka");

                entity.HasIndex(e => e.NazivApoteke, "UQ_TApoteka_NazivApoteke")
                    .IsUnique();

                entity.Property(e => e.ApotekaId).HasColumnName("apotekaId");

                entity.Property(e => e.NazivApoteke)
                    .HasMaxLength(65)
                    .HasColumnName("nazivApoteke");
            });

            modelBuilder.Entity<ApotekaProizvod>(entity =>
            {
                entity.ToTable("ApotekaProizvod");

                entity.Property(e => e.ApotekaProizvodId).HasColumnName("apotekaProizvodId");

                entity.Property(e => e.ApotekaId).HasColumnName("apotekaId");

                entity.Property(e => e.CenaBezPopusta)
                    .HasColumnType("numeric(10, 2)")
                    .HasColumnName("cenaBezPopusta");

                entity.Property(e => e.CenaSaPopustom)
                    .HasColumnType("numeric(10, 2)")
                    .HasColumnName("cenaSaPopustom");

                entity.Property(e => e.PopustUprocentima)
                    .HasColumnType("numeric(5, 2)")
                    .HasColumnName("popustUProcentima");

                entity.Property(e => e.ProizvodId).HasColumnName("proizvodId");

                entity.Property(e => e.Slika)
                    .IsUnicode(false)
                    .HasColumnName("slika");

                entity.Property(e => e.StanjeZaliha).HasColumnName("stanjeZaliha");

                entity.HasOne(d => d.Apoteka)
                    .WithMany(p => p.ApotekaProizvod)
                    .HasForeignKey(d => d.ApotekaId)
                    .HasConstraintName("FK_ApotekaProizvod_Apoteka");

                entity.HasOne(d => d.Proizvod)
                    .WithMany(p => p.ApotekaProizvod)
                    .HasForeignKey(d => d.ProizvodId)
                    .HasConstraintName("FK_ApotekaProizvod_Proizvod");
            });

            modelBuilder.Entity<Korisnik>(entity =>
            {
                entity.ToTable("Korisnik");

                entity.HasIndex(e => e.Email, "UQ_Korisnik_Email")
                    .IsUnique();

                entity.Property(e => e.KorisnikId).HasColumnName("korisnikId");

                entity.Property(e => e.Broj)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("broj");

                entity.Property(e => e.BrojTelefona)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .HasColumnName("brojTelefona");

                entity.Property(e => e.Email)
                    .HasMaxLength(35)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.Ime)
                    .HasMaxLength(35)
                    .HasColumnName("ime");

                entity.Property(e => e.Lozinka)
                    .IsUnicode(false)
                    .HasColumnName("lozinka");

                entity.Property(e => e.Mesto)
                    .HasMaxLength(35)
                    .HasColumnName("mesto");

                entity.Property(e => e.Prezime)
                    .HasMaxLength(35)
                    .HasColumnName("prezime");

                /*entity.Property(e => e.TipKorisnika)
                .HasConversion(
                    v => v.ToString(),
                    v => (TipKorisnikaEnum)Enum.Parse(typeof(TipKorisnikaEnum), v));*/

                entity.Property(e => e.Ulica)
                    .HasMaxLength(35)
                    .HasColumnName("ulica");

            });

            modelBuilder.Entity<Porudzbina>(entity =>
            {
                entity.ToTable("Porudzbina");

                entity.HasIndex(e => e.BrojPorudzbine, "UQ_Porudzbina_BrojPorudzbine")
                    .IsUnique();

                entity.Property(e => e.PorudzbinaId).HasColumnName("porudzbinaId");

                entity.Property(e => e.BrojPorudzbine)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("brojPorudzbine");

                entity.Property(e => e.DatumPlacanja)
                    .HasColumnType("date")
                    .HasColumnName("datumPlacanja");

                entity.Property(e => e.DatumKreiranja)
                    .HasColumnType("date")
                    .HasColumnName("datumKreiranja");

                entity.Property(e => e.KorisnikId).HasColumnName("korisnikId");

                entity.Property(e => e.PlacenaPorudzbina).HasColumnName("placenaPorudzbina");

                entity.Property(e => e.UkupanIznos)
                    .HasColumnType("numeric(10, 2)")
                    .HasColumnName("ukupanIznos");

                entity.Property(e => e.UplataId)
                    .IsUnicode(false)
                    .HasColumnName("uplataId");

                entity.HasOne(d => d.Korisnik)
                    .WithMany(p => p.Porudzbina)
                    .HasForeignKey(d => d.KorisnikId)
                    .HasConstraintName("FK_Porudzbina_Korisnik");
            });

            modelBuilder.Entity<Proizvod>(entity =>
            {
                entity.ToTable("Proizvod");

                entity.Property(e => e.ProizvodId).HasColumnName("proizvodId");

                entity.Property(e => e.NazivProizvoda)
                    .HasMaxLength(35)
                    .HasColumnName("nazivProizvoda");

                entity.Property(e => e.Proizvodjac)
                    .HasMaxLength(35)
                    .HasColumnName("proizvodjac");

                entity.Property(e => e.TipProizvodaId).HasColumnName("tipProizvodaId");

                entity.HasOne(d => d.TipProizvoda)
                    .WithMany(p => p.Proizvod)
                    .HasForeignKey(d => d.TipProizvodaId)
                    .HasConstraintName("FK_Proizvod_TipProizvoda");
            });

            modelBuilder.Entity<StavkaPorudzbine>(entity =>
            {
                entity.HasKey(e => e.StavkaId)
                    .HasName("PK__StavkaPo__07F79C2DDC47E720");

                entity.ToTable("StavkaPorudzbine");

                entity.Property(e => e.StavkaId).HasColumnName("stavkaId");

                entity.Property(e => e.ApotekaProizvodId).HasColumnName("apotekaProizvodId");

                entity.Property(e => e.Cena)
                    .HasColumnType("numeric(10, 2)")
                    .HasColumnName("cena");

                entity.Property(e => e.Kolicina).HasColumnName("kolicina");

                entity.Property(e => e.Popust)
                    .HasColumnType("numeric(5, 2)")
                    .HasColumnName("popust");

                entity.Property(e => e.PorudzbinaId).HasColumnName("porudzbinaId");

                entity.HasOne(d => d.ApotekaProizvod)
                    .WithMany(p => p.StavkaPorudzbine)
                    .HasForeignKey(d => d.ApotekaProizvodId)
                    .HasConstraintName("FK_StavkaPorudzbine_ApotekaProizvod");

                entity.HasOne(d => d.Porudzbina)
                    .WithMany(p => p.StavkaPorudzbine)
                    .HasForeignKey(d => d.PorudzbinaId)
                    .HasConstraintName("FK_StavkaPorudzbine_Porudzbina");
            });

            modelBuilder.Entity<TipProizvoda>(entity =>
            {
                entity.HasKey(e => e.TipProizvodaId)
                    .HasName("PK__TipProiz__C11E18FF67244E07");

                entity.HasIndex(e => e.NazivTipaProizvoda, "UQ_TipProizvoda_NazivTipaProizvoda")
                    .IsUnique();

                entity.Property(e => e.TipProizvodaId).HasColumnName("tipProizvodaId");

                entity.Property(e => e.NazivTipaProizvoda)
                    .HasMaxLength(20)
                    .HasColumnName("nazivTipaProizvoda");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
