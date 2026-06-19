using System.Collections.Generic;

namespace Car_Colour_Project.Models;

public sealed class User
{
    public required string Id { get; init; }
    public required string Username { get; init; }
    public required string Email { get; init; }
    public required string Password { get; init; }
    public string? ProfilePic { get; init; }
    public List<string>? DisabledModules { get; init; }
}
