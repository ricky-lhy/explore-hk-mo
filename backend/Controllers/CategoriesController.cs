using ExploreHKMOApi.Services;
using ExploreHKMOApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CategoriesController(AppDbContext db)
    {
        _db = db;
    }

    //GET /categories?region=hk
    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetList([FromQuery] string? region)
    {
        var query = _db.Places.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(region))
        {
            var normalized = NormalizeRegion(region);
            query = query.Where(p => p.Region == normalized);
        }

        var categories = await query.Select(p => p.Category).Distinct().OrderBy(x => x).ToListAsync();
        return Ok(categories);
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