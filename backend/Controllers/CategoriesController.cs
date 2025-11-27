using ExploreHKMOApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("categories")]
public class CategoriesController : ControllerBase
{
    private readonly IPlaceMemory _memory;

    public CategoriesController(IPlaceMemory memory)
    {
        _memory = memory;
    }

    //GET /categories?region=hk
    [HttpGet]
    public ActionResult<IEnumerable<string>> Get([FromQuery] string? region)
    {
        var categories = _memory.GetCategories(region);        
        return Ok(categories);
    }
}