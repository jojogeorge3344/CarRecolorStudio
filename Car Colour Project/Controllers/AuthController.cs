using Microsoft.AspNetCore.Mvc;
using Car_Colour_Project.Services;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;

    public AuthController(IConfiguration configuration, IUserService userService)
    {
        _configuration = configuration;
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var inputUser = request.Username?.Trim() ?? string.Empty;
        var inputPassword = request.Password ?? string.Empty;

        // 1. Check against the user database (matching by email or username)
        var user = await _userService.GetByEmailAsync(inputUser, cancellationToken);
        if (user is null)
        {
            var allUsers = await _userService.GetAllAsync(cancellationToken);
            user = allUsers.FirstOrDefault(u => string.Equals(u.Username.Trim(), inputUser, StringComparison.OrdinalIgnoreCase));
        }

        bool success = false;
        if (user is not null)
        {
            success = string.Equals(user.Password, inputPassword, StringComparison.Ordinal);
        }
        else
        {
            // 2. Fallback to appsettings config credentials
            var configuredUsername = _configuration["LoginCredentials:Username"]?.Trim();
            var configuredPassword = _configuration["LoginCredentials:Password"];

            if (!string.IsNullOrWhiteSpace(configuredUsername) && !string.IsNullOrWhiteSpace(configuredPassword))
            {
                success = string.Equals(inputUser, configuredUsername, StringComparison.OrdinalIgnoreCase)
                    && string.Equals(inputPassword, configuredPassword, StringComparison.Ordinal);
            }
        }

        if (success)
        {
            if (user is not null)
            {
                return Ok(new { 
                    success = true, 
                    user = new { 
                        username = user.Username, 
                        email = user.Email, 
                        profilePic = user.ProfilePic,
                        disabledModules = user.DisabledModules ?? new System.Collections.Generic.List<string>()
                    } 
                });
            }
            else
            {
                var configuredUsername = _configuration["LoginCredentials:Username"]?.Trim() ?? "Admin";
                return Ok(new { 
                    success = true, 
                    user = new { 
                        username = "Admin", 
                        email = configuredUsername, 
                        profilePic = (string?)null,
                        disabledModules = new System.Collections.Generic.List<string>()
                    } 
                });
            }
        }

        return Ok(new { success = false });
    }

    [HttpGet("emails")]
    public async Task<IActionResult> GetEmails(CancellationToken cancellationToken)
    {
        var emails = new List<string>();
        var configuredUsername = _configuration["LoginCredentials:Username"]?.Trim();
        if (!string.IsNullOrWhiteSpace(configuredUsername))
        {
            emails.Add(configuredUsername);
        }

        var users = await _userService.GetAllAsync(cancellationToken);
        emails.AddRange(users.Select(u => u.Email));
        emails.AddRange(users.Select(u => u.Username));

        return Ok(emails.Distinct(StringComparer.OrdinalIgnoreCase));
    }

    public sealed class LoginRequest
    {
        public string? Username { get; init; }
        public string? Password { get; init; }
    }
}

