using System.Globalization;
using ExploreHKMOApi.Models;
using ExploreHKMOApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("routes")]
public class RoutesController : ControllerBase
{
    private readonly IPlaceMemory _placeMemory;
    private readonly IRoutingService _routingService;

    public RoutesController(IPlaceMemory placeMemory, IRoutingService routingService)
    {
        _placeMemory = placeMemory;
        _routingService = routingService;
    }

    [HttpPost("day")]
    public async Task<ActionResult<DayRouteResponse>> ComputeDayRoute(
        [FromBody] DayRouteRequest request,
        CancellationToken cancellationToken)
    {

        if (!DateTime.TryParseExact(request.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var requestDate))
        {
            return UnprocessableEntity(new ErrorResponse(
                Message: "錯誤的日期格式"
            ));
        }

        var hkTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Hong_Kong");
        var todayHk = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, hkTimeZone).Date;

        if (requestDate.Date < todayHk)
        {
            return UnprocessableEntity(new ErrorResponse(
                Message: "不能搜索過去的日期",
                Details: new Dictionary<string, object>
                {
                    ["inputDate"] = request.Date,
                    ["today"] = todayHk.ToString("yyyy-MM-dd"),
                    ["timezone"] = "Asia/Hong_Kong"
                }
            ));
        }

        if (request.PlaceIds == null || request.PlaceIds.Count < 2)
        {
            return UnprocessableEntity(new ErrorResponse(
                Message: "需要至少兩個地點"
            ));
        }
        

        var allPlaces = _placeMemory.GetAll();
        var placeMap = allPlaces.ToDictionary(p => p.Id);
        var orderedPlaces = new List<Models.Place>();
        foreach(var id in request.PlaceIds)
        {
            if (!placeMap.TryGetValue(id, out var place))
            {
                return UnprocessableEntity(new ErrorResponse(
                    Message: "找不到地點",
                    Details: new Dictionary<string, object>
                    {
                        ["id"] = id
                    }
                ));
            }
            orderedPlaces.Add(place);
        }
        
        var firstRegion = orderedPlaces[0].Region;
        var allSameRegion = orderedPlaces.All(p => string.Equals(p.Region, firstRegion, StringComparison.OrdinalIgnoreCase));
        if (!allSameRegion)
        {
            return UnprocessableEntity(new ErrorResponse(
                Message: "所有地點必須在同一地區",
                Details: new Dictionary<string, object>
                {
                    ["regions"] = orderedPlaces.Select(p => new {p.Id, p.Region}).ToList()
                }
            ));
        }

        var result = await _routingService.ComputeDayRouteAsync(request, orderedPlaces, cancellationToken);
        return Ok(result);
    }
}