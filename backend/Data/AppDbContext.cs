using Microsoft.EntityFrameworkCore;
using ExploreHKMOApi.Models;

namespace ExploreHKMOApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }

    public DbSet<PlaceEntity> Places => Set<PlaceEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var place = modelBuilder.Entity<PlaceEntity>();
        place.HasKey(p => p.Id);
        place.Property(p => p.Id).ValueGeneratedNever();
        place.OwnsOne(p => p.Description);
        place.OwnsOne(p => p.Location);
        place.OwnsOne(p => p.Connection);
        place.Property(p => p.ImagesJson).HasColumnType("nvarchar(max)");
        place.Property(p => p.HoursJson).HasColumnType("nvarchar(max)");
    }

}