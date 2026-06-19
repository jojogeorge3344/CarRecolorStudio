using System.Text.Json;
using Car_Colour_Project.Models;

namespace Car_Colour_Project.Repository;

public sealed class UserRepository : IUserRepository
{
    private readonly JsonDataLoader _dataLoader;
    private readonly SemaphoreSlim _syncLock = new(1, 1);
    private readonly JsonSerializerOptions _serializerOptions = new() { WriteIndented = true };
    private readonly string _usersFilePath;
    private IReadOnlyList<User>? _cache;

    public UserRepository(JsonDataLoader dataLoader, IWebHostEnvironment environment)
    {
        _dataLoader = dataLoader;
        _usersFilePath = Path.Combine(environment.ContentRootPath, "data", "users.json");
    }

    public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        if (_cache is not null)
        {
            return _cache;
        }

        await _syncLock.WaitAsync(cancellationToken);
        try
        {
            if (_cache is null)
            {
                _cache = await _dataLoader.LoadListAsync<User>(Path.Combine("data", "users.json"), cancellationToken);
            }

            return _cache;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    public async Task<IReadOnlyList<User>> SearchAsync(string term, CancellationToken cancellationToken = default)
    {
        var users = await GetAllAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(term))
        {
            return users;
        }

        return users
            .Where(u => u.Username.Contains(term, StringComparison.OrdinalIgnoreCase)
                || u.Email.Contains(term, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<User?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return null;
        }

        var users = await GetAllAsync(cancellationToken);
        return users.FirstOrDefault(u => string.Equals(u.Id, id, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        var users = await GetAllAsync(cancellationToken);
        return users.FirstOrDefault(u => string.Equals(u.Email.Trim(), email.Trim(), StringComparison.OrdinalIgnoreCase));
    }

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _syncLock.WaitAsync(cancellationToken);
        try
        {
            _cache ??= await _dataLoader.LoadListAsync<User>(Path.Combine("data", "users.json"), cancellationToken);

            var users = _cache.ToList();
            if (users.Any(existing => string.Equals(existing.Email.Trim(), user.Email.Trim(), StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException("A user with the same email already exists.");
            }

            users.Add(user);
            await WriteUsersAsync(users, cancellationToken);
            _cache = users;

            return user;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    public async Task<User?> UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        await _syncLock.WaitAsync(cancellationToken);
        try
        {
            _cache ??= await _dataLoader.LoadListAsync<User>(Path.Combine("data", "users.json"), cancellationToken);

            var users = _cache.ToList();
            var index = users.FindIndex(existing => string.Equals(existing.Id, user.Id, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return null;
            }

            // Check if email is being updated to an existing user's email
            if (users.Any(existing => !string.Equals(existing.Id, user.Id, StringComparison.OrdinalIgnoreCase)
                && string.Equals(existing.Email.Trim(), user.Email.Trim(), StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException("A user with the same email already exists.");
            }

            users[index] = user;
            await WriteUsersAsync(users, cancellationToken);
            _cache = users;

            return user;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    public async Task<User?> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return null;
        }

        await _syncLock.WaitAsync(cancellationToken);
        try
        {
            _cache ??= await _dataLoader.LoadListAsync<User>(Path.Combine("data", "users.json"), cancellationToken);

            var users = _cache.ToList();
            var index = users.FindIndex(existing => string.Equals(existing.Id, id, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return null;
            }

            var removed = users[index];
            users.RemoveAt(index);

            await WriteUsersAsync(users, cancellationToken);
            _cache = users;

            return removed;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    private async Task WriteUsersAsync(List<User> users, CancellationToken cancellationToken)
    {
        var directory = Path.GetDirectoryName(_usersFilePath)!;
        Directory.CreateDirectory(directory);

        await using var stream = File.Create(_usersFilePath);
        await JsonSerializer.SerializeAsync(stream, users, _serializerOptions, cancellationToken);
    }
}
