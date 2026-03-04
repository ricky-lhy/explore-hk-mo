using System.Globalization;
using System.Text.Json;
using ExploreHKMOApi.Models;
using ExploreHKMOApi.Services;
using ExploreHKMOApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("routes")]
public class RoutesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IRoutingService _routingService;

    public RoutesController(AppDbContext db, IRoutingService routingService)
    {
        _db = db;
        _routingService = routingService;
    }

    [HttpPost("day")]
    public async Task<ActionResult<DayRouteResponse>> ComputeDayRoute(
        [FromBody] DayRouteRequest request,
        CancellationToken cancellationToken)
    {

        if (!DateTime.TryParseExact(request.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var requestDate))
        {
            return UnprocessableEntity(new
            {
                message = "Invalid date format"
            });
        }

        var hkTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Hong_Kong");
        var todayHk = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, hkTimeZone).Date;

        if (requestDate.Date < todayHk)
        {
            return UnprocessableEntity(
                new
                {
                    message = "Cannot search for past dates",
                    inputDate = request.Date,
                    today = todayHk.ToString("yyyy-MM-dd"),
                    timezone = "Asia/Hong_Kong",
                }
            );
        }

        if (request.PlaceIds == null || request.PlaceIds.Count < 2)
        {
            return UnprocessableEntity(new { message = "At least two places are required" });
        }
        
        var ids = request.PlaceIds.Distinct().ToList();
        var entities = await _db.Places.AsNoTracking().Where(p => ids.Contains(p.Id)).ToListAsync();
        var placeMap = entities.ToDictionary(x => x.Id);

        var orderedPlaces = new List<Place>(request.PlaceIds.Count);
        foreach(var id in request.PlaceIds)
        {
            if (!placeMap.TryGetValue(id, out var entity))
            {
                return UnprocessableEntity(new { message = "Place not found", id });
            }
            orderedPlaces.Add(MapToPlace(entity));
        }
        
        var firstRegion = orderedPlaces[0].Region;
        if (orderedPlaces.Any(p => !string.Equals(p.Region, firstRegion, StringComparison.OrdinalIgnoreCase)))
        {
            return UnprocessableEntity(new
            {
                message = "All places must be in the same region",
                regions = orderedPlaces.Select(p => new {p.Id, p.Region}).ToList()
            });
        }

        var result = await _routingService.ComputeDayRouteAsync(request, orderedPlaces, cancellationToken);
        return Ok(result);
    }

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static Place MapToPlace(PlaceEntity e)
    {
        List<string> images;
        try
        {
            images = string.IsNullOrWhiteSpace(e.ImagesJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(e.ImagesJson, _jsonOptions) ?? new List<string>();
        }
        catch (JsonException)
        {
            images = new List<string>();
        }

        Hours? hours = null;
        try
        {
            if (!string.IsNullOrWhiteSpace(e.HoursJson))
                hours = JsonSerializer.Deserialize<Hours>(e.HoursJson, _jsonOptions);
        }
        catch (JsonException)
        {
            hours = null;
        }

        return new Place
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            Region = e.Region,
            Category = e.Category,
            Hours = hours,
            Location = e.Location,
            Images = images,
            Rating = e.Rating,
            Ranking = e.Ranking,
            Phone = e.Phone,
            Website = e.Website,
            Connection = e.Connection
        };
    }
}