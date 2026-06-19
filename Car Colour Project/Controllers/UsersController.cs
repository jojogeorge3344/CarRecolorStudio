using Car_Colour_Project.Models;
using Car_Colour_Project.Services;
using Microsoft.AspNetCore.Mvc;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IWebHostEnvironment _environment;

    public UsersController(IUserRepository userRepository, IWebHostEnvironment environment)
    {
        _userRepository = userRepository;
        _environment = environment;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);
        return Ok(users);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string term, CancellationToken cancellationToken)
    {
        var users = await _userRepository.SearchAsync(term, cancellationToken);
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateUserRequest request, CancellationToken cancellationToken)
    {
        var username = request.Username?.Trim();
        var email = request.Email?.Trim();
        var password = request.Password;

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return BadRequest("Username, Email and Password are required.");
        }

        try
        {
            var userId = Guid.NewGuid().ToString("N");
            var profilePicPath = await SaveProfilePicAsync(request.ProfilePic, userId, null, cancellationToken);

            var user = new User
            {
                Id = userId,
                Username = username,
                Email = email,
                Password = password,
                ProfilePic = profilePicPath
            };

            var created = await _userRepository.AddAsync(user, cancellationToken);
            return Created($"/api/users/{created.Id}", created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromForm] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest("User id is required.");
        }

        var username = request.Username?.Trim();
        var email = request.Email?.Trim();
        var password = request.Password;

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return BadRequest("Username, Email and Password are required.");
        }

        try
        {
            var existing = await _userRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null)
            {
                return NotFound("User not found.");
            }

            var profilePicPath = await SaveProfilePicAsync(request.ProfilePic, existing.Id, existing.ProfilePic, cancellationToken);

            var updatedUser = new User
            {
                Id = existing.Id,
                Username = username,
                Email = email,
                Password = password,
                ProfilePic = profilePicPath
            };

            var updated = await _userRepository.UpdateAsync(updatedUser, cancellationToken);
            if (updated is null)
            {
                return NotFound("User not found.");
            }

            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest("User id is required.");
        }

        var existing = await _userRepository.GetByIdAsync(id, cancellationToken);
        if (existing is not null && string.Equals(existing.Email.Trim(), "jojogeorge3344@gmail.com", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Cannot delete the super admin user.");
        }

        var deleted = await _userRepository.DeleteAsync(id, cancellationToken);
        if (deleted is null)
        {
            return NotFound("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(deleted.ProfilePic))
        {
            var filePath = Path.Combine(_environment.WebRootPath, deleted.ProfilePic.Replace('/', Path.DirectorySeparatorChar));
            if (System.IO.File.Exists(filePath))
            {
                try { System.IO.File.Delete(filePath); } catch {}
            }
        }

        return Ok(new { success = true, deletedUserId = deleted.Id });
    }

    [HttpPut("{id}/authorization")]
    public async Task<IActionResult> UpdateAuthorization(string id, [FromBody] System.Collections.Generic.List<string> disabledModules, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest("User id is required.");
        }

        var existing = await _userRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound("User not found.");
        }

        if (string.Equals(existing.Email.Trim(), "jojogeorge3344@gmail.com", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Cannot modify authorization for the super admin.");
        }

        var updatedUser = new User
        {
            Id = existing.Id,
            Username = existing.Username,
            Email = existing.Email,
            Password = existing.Password,
            ProfilePic = existing.ProfilePic,
            DisabledModules = disabledModules
        };

        var updated = await _userRepository.UpdateAsync(updatedUser, cancellationToken);
        if (updated is null)
        {
            return NotFound("User not found.");
        }

        return Ok(updated);
    }

    private async Task<string?> SaveProfilePicAsync(IFormFile? file, string userId, string? existingProfilePic, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingProfilePic;
        }

        var folder = Path.Combine(_environment.WebRootPath, " Profile Pic");
        Directory.CreateDirectory(folder);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var fileName = $"{userId}{extension}";
        var fullPath = Path.Combine(folder, fileName);

        foreach (var ext in new[] { ".png", ".jpg", ".jpeg", ".webp" })
        {
            var oldPath = Path.Combine(folder, $"{userId}{ext}");
            if (System.IO.File.Exists(oldPath))
            {
                try { System.IO.File.Delete(oldPath); } catch {}
            }
        }

        await using var stream = System.IO.File.Create(fullPath);
        await file.CopyToAsync(stream, cancellationToken);

        return $" Profile Pic/{fileName}";
    }

    public sealed class CreateUserRequest
    {
        public string? Username { get; init; }
        public string? Email { get; init; }
        public string? Password { get; init; }
        public IFormFile? ProfilePic { get; init; }
    }

    public sealed class UpdateUserRequest
    {
        public string? Username { get; init; }
        public string? Email { get; init; }
        public string? Password { get; init; }
        public IFormFile? ProfilePic { get; init; }
    }
}
