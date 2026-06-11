using Microsoft.AspNetCore.Mvc;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var configuredUsername = _configuration["LoginCredentials:Username"]?.Trim();
        var configuredPassword = _configuration["LoginCredentials:Password"];

        if (string.IsNullOrWhiteSpace(configuredUsername) || string.IsNullOrWhiteSpace(configuredPassword))
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { success = false, message = "Login credentials are not configured." });
        }

        var username = request.Username?.Trim() ?? string.Empty;
        var password = request.Password ?? string.Empty;

        var success = string.Equals(username, configuredUsername, StringComparison.OrdinalIgnoreCase)
            && string.Equals(password, configuredPassword, StringComparison.Ordinal);

        return Ok(new { success });
    }

    public sealed class LoginRequest
    {
        public string? Username { get; init; }
        public string? Password { get; init; }
    }
}
