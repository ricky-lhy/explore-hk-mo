using System.ComponentModel.DataAnnotations;

namespace ExploreHKMOApi.Models;

public class PlaceEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Region { get; set; } = "";
    public string Category { get; set; } = "";
    public Description Description { get; set; } = new();
    public Location Location { get; set; } = new();

    // Json Columns
    public string ImagesJson { get; set; } = "[]";
    public string? HoursJson { get; set; }
    public double? Rating { get; set; }
    public int? Ranking { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public Connection? Connection { get; set; }
}