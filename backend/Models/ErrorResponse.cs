namespace ExploreHKMOApi.Models;

public record ErrorResponse(
    string Message,
    Dictionary<string, object>? Details = null
);
