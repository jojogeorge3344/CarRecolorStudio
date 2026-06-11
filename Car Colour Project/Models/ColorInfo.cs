namespace Car_Colour_Project.Models;

public sealed class ColorInfo
{
    public required string Name { get; init; }
    public required string Hex { get; init; }
    public string Category { get; init; } = "Custom";
}
