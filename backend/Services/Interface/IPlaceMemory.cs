using ExploreHKMOApi.Models;

namespace ExploreHKMOApi.Services;

public interface IPlaceMemory
{
    IReadOnlyList<Place> GetAll();
    Place? GetById(int id);
    IReadOnlyList<string> GetCategories(string? region = null);
}