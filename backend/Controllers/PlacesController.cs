using ExploreHKMOApi.Models;
using ExploreHKMOApi.Services;
using ExploreHKMOApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Text.Json;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("places")]
public class PlacesController : ControllerBase
{
    private readonly AppDbContext _db;
    public PlacesController(AppDbContext db)
    {
        _db = db;
    }

    //GET /places?region=hk&categories=entertainment&orderBy=ranking&orderDir=asc&limit=10&cursor=13
    [HttpGet]
    public async Task<ActionResult<PlacesPageResponse>> GetList(
        [FromQuery] string? region,
        [FromQuery] string? categories,
        [FromQuery] string? orderBy,
        [FromQuery] string? orderDir,
        [FromQuery] int? limit,
        [FromQuery] int? cursor)
    {
        var pageSize = limit?? 10;
        if (pageSize <= 0) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var query = _db.Places.AsNoTracking().AsQueryable();
        if (!string.IsNullOrEmpty(region))
        {
            var normalized = NormalizeRegion(region);
            query = query.Where(p => p.Region == normalized);
        }

        if (!string.IsNullOrEmpty(categories))
        {
            var set = categories.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(c => c.Trim().ToLower())
                                .ToHashSet();
            query = query.Where(p => set.Contains(p.Category.ToLower()));
        }

        var dir = (orderDir?? "asc").ToLower();
        var key = (orderBy?? "id"). ToLower();

        query = key switch
        {
            "rating" => dir == "desc" ? query.OrderByDescending(p => p.Rating ?? 0).ThenBy(p => p.Id):
                                        query.OrderBy(p => p.Rating ?? 0).ThenBy(p => p.Id),
            "name" => dir == "desc" ? query.OrderByDescending(p => p.Name).ThenBy(p => p.Id):
                                      query.OrderBy(p => p.Name).ThenBy(p => p.Id),
            "ranking" => dir == "desc" ? query.OrderByDescending(p => p.Ranking ?? int.MaxValue).ThenBy(p => p.Id):
                                         query.OrderBy(p => p.Ranking ?? int.MaxValue).ThenBy(p => p.Id),
            _ => dir == "desc" ? query.OrderByDescending(p => p.Id) : query.OrderBy(p => p.Id)
        };

        var orderedList = await query.ToListAsync();

        // cursor paging
        int startIndex = 0;
        if (cursor.HasValue)
        {
            var idx = orderedList.FindIndex(p => p.Id == cursor.Value);
            if (idx < 0)
            {
                return UnprocessableEntity(new
                {
                    message = "Invalid cursor",
                    cursor = cursor.Value,
                    region,
                    categories,
                    orderBy = key,
                    orderDir = dir
                });
            }
            startIndex = idx;
        }

        var pagePlusOne = orderedList.Skip(startIndex).Take(pageSize + 1).ToList();
        int? nextCursor = null;
        if (pagePlusOne.Count > pageSize)
        {
            nextCursor = pagePlusOne[pageSize].Id;
            pagePlusOne = pagePlusOne.Take(pageSize).ToList();
        }
        
        var placesDto = pagePlusOne.Select(MapToPlace).ToList();
        var response = new PlacesPageResponse(placesDto, nextCursor);
        return Ok(response);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Place>> GetById(int id)
    {
        var entity = await _db.Places.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        if (entity is null)
            return NotFound(new { message = "Place not found", id });
        return Ok(MapToPlace(entity));
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

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static Place MapToPlace(PlaceEntity e)
    {
        // ImagesJson: string -> List<string>
        List<string> images;
        try
        {
            images = string.IsNullOrWhiteSpace(e.ImagesJson)? new List<string>() : JsonSerializer.Deserialize<List<string>>(e.ImagesJson, _jsonOptions) ?? new List<string>();
        }
        catch(JsonException)
        {
            images = new List<string>();
        }

        //HoursJson: string -> Hours?
        Hours? hours = null;
        try
        {
            if (!string.IsNullOrWhiteSpace(e.HoursJson))
            {
                hours = JsonSerializer.Deserialize<Hours>(e.HoursJson, _jsonOptions);
            }
        }
        catch(JsonException)
        {
            hours = null;
        }

        return new Place
        {
            Id = e.Id,
            Name = e.Name,
            Region = e.Region,
            Category = e.Category,
            Description = e.Description,
            Location = e.Location,
            Hours = hours,
            Images = images,
            Rating = e.Rating,
            Ranking = e.Ranking,
            Phone = e.Phone,
            Website = e.Website,
            Connection = e.Connection
        };
    }
}