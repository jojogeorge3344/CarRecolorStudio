using System.ComponentModel.DataAnnotations;

namespace Car_Colour_Project.Models;

public sealed class RecolorRequest
{
    [Required]
    public required string CarId { get; init; }

    [Required]
    [RegularExpression("^#(?:[0-9a-fA-F]{3}){1,2}$")]
    public required string HexColor { get; init; }
}
