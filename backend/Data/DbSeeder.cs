using System.Text.Json;
using ExploreHKMOApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExploreHKMOApi.Data;

public static class DbSeeder
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task SeedPlacesIfEmptyAsync(
        AppDbContext db, 
        string placesFolderPath, 
        CancellationToken cancellationToken = default)
    {
        await db.Database.MigrateAsync(cancellationToken);

        if (await db.Places.AsNoTracking().AnyAsync(cancellationToken))
            return;
        
        if (!Directory.Exists(placesFolderPath))
            throw new DirectoryNotFoundException($"Places folder not found: {placesFolderPath}");
        
        var files = Directory.GetFiles(placesFolderPath, "*.json", SearchOption.TopDirectoryOnly);
        if (files.Length == 0) return;

        var entities = new List<PlaceEntity>(files.Length);

        foreach(var file in files)
        {
            var json = await File.ReadAllTextAsync(file, cancellationToken);
            var place = JsonSerializer.Deserialize<Place>(json, JsonOptions);
            if (place is null) continue;

            entities.Add(MapToEntity(place));
        }

        db.Places.AddRange(entities);
        await db.SaveChangesAsync(cancellationToken);
    }

    private static PlaceEntity MapToEntity(Place p)
    {
        return new PlaceEntity
        {
            Id = p.Id,
            Name = p.Name,
            Region = p.Region,
            Category = p.Category,

            Description = p.Description ?? new Description(),
            Location = p.Location ?? new Location(),
            Connection = p.Connection,

            Rating = p.Rating,
            Ranking = p.Ranking,
            Phone = p.Phone,
            Website = p.Website,

            ImagesJson = JsonSerializer.Serialize(p.Images ?? new List<string>(), JsonOptions),
            HoursJson = p.Hours is null ? null : JsonSerializer.Serialize(p.Hours, JsonOptions),
        };
    }
}