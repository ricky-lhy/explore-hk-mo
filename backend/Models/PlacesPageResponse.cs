using System.Text.Json.Serialization;

namespace ExploreHKMOApi.Models;

public record PlacesPageResponse(
    [property: JsonPropertyName("places")] List<Place> Places,
    [property: JsonPropertyName("nextCursor")] int? NextCursor
);