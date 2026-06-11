namespace Car_Colour_Project.Models;

public sealed class RecolorResponse
{
    public bool Success { get; init; }
    public string? ImageUrl { get; init; }
    public string? Message { get; init; }
}
