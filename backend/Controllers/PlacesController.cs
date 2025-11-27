using ExploreHKMOApi.Models;
using ExploreHKMOApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("places")]
public class PlacesController : ControllerBase
{
    private readonly IPlaceMemory _memory;

    public PlacesController(IPlaceMemory memory)
    {
        _memory = memory;
    }

    //GET /places?region=hk&categories=entertainment&orderBy=ranking&orderDir=asc&limit=10
    [HttpGet]
    public ActionResult<IEnumerable<Place>> GetList(
        [FromQuery] string? region,
        [FromQuery] string? categories,
        [FromQuery] string? orderBy,
        [FromQuery] string? orderDir,
        [FromQuery] int? limit)
    {
        IEnumerable<Place> items = _memory.GetAll();

        if (!string.IsNullOrEmpty(region))
        {
            var normalized = NormalizeRegion(region);
            items = items.Where(p => p.Region.Equals(normalized, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(categories))
        {
            var set = categories.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(c => c.Trim().ToLower())
                                .ToHashSet();
            items = items.Where(p => set.Contains(p.Category.ToLower()));
        }

        items = (orderBy ?? "Id").ToLower() switch
        {
            "rating" => ApplyOrder(items, p => p.Rating ?? 0, orderDir),
            "name" => ApplyOrder(items, p => p.Name, orderDir),
            "ranking" => ApplyOrder(items, p => p.Ranking ?? int.MaxValue, orderDir),
            _ => ApplyOrder(items, p => p.Id, orderDir)
        };

        if (limit is > 0)
            items = items.Take(limit.Value);
        
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public ActionResult<Place> GetById(int id)
    {
        var place = _memory.GetById(id);
        if (place is null) return NotFound();
        return Ok(place);
    }

    private static IOrderedEnumerable<T> ApplyOrder<T, TKey>(
        IEnumerable<T> src,
        Func<T, TKey> keySelector,
        string? orderDir)
    {
        return (orderDir?? "asc").ToLower() == "desc"
            ? src.OrderByDescending(keySelector) : src.OrderBy(keySelector);
    }

    private static string NormalizeRegion(string regionParam)
    => regionParam.ToLower() switch
    {
        "hk" => "hong-kong",
        "hong kong" => "hong-kong",
        "mo" => "macau",
        "macau" => "macau",
        _ => regionParam.ToLower()
    };
}