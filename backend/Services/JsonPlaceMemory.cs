using System.Text.Json;
using ExploreHKMOApi.Models;

namespace ExploreHKMOApi.Services;

public class JsonPlaceMemory : IPlaceMemory
{
    private static readonly Lazy<List<Place>> _placesLazy = new Lazy<List<Place>>(LoadAllPlaces, isThreadSafe: true);
    private static List<Place> Places => _placesLazy.Value;

    public IReadOnlyList<Place> GetAll() => Places;

    public Place? GetById(int id) => Places.FirstOrDefault(p => p.Id == id);

    public IReadOnlyList<string> GetCategories(string? region = null)
    {
        IEnumerable<Place> query = Places;
        if (!string.IsNullOrEmpty(region))
        {
            var normalized = NormalizeRegion(region);
            query = query.Where(p => p.Region.Equals(normalized, StringComparison.OrdinalIgnoreCase));
        }

        return query.Select(p => p.Category).Distinct(StringComparer.OrdinalIgnoreCase).OrderBy(c => c).ToList();
    }


    private static List<Place> LoadAllPlaces()
    {
        var result = new List<Place>();
        var baseDir = AppContext.BaseDirectory;
        var placesDir = Path.Combine(baseDir, "Data", "places");

        if (!Directory.Exists(placesDir)) return result;

        var jsonFiles = Directory.GetFiles(placesDir, "*.json", SearchOption.TopDirectoryOnly);
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        foreach(var file in jsonFiles)
        {
            try
            {
                var json = File.ReadAllText(file);
                var place = JsonSerializer.Deserialize<Place>(json, options);
                if (place != null) result.Add(place);
            }
            catch
            {
                
            }
        }
        return result;
    }
    private static string NormalizeRegion(string regionParam) => 
    regionParam.ToLower() switch
    {
        "hk" => "hong-kong",
        "mo" => "macau",
        "hong-kong" => "hong-kong",
        "macau" => "macau",
        _ => regionParam.ToLower()
    };
}