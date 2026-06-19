using System.Text.Json;

namespace Car_Colour_Project.Repository;

public sealed class JsonDataLoader
{
    private readonly IWebHostEnvironment _environment;
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public JsonDataLoader(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<IReadOnlyList<T>> LoadListAsync<T>(string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_environment.ContentRootPath, relativePath);
        if (!File.Exists(fullPath))
        {
            return Array.Empty<T>();
        }

        await using var stream = File.OpenRead(fullPath);
        var items = await JsonSerializer.DeserializeAsync<List<T>>(stream, _serializerOptions, cancellationToken);
        return items ?? new List<T>();
    }
}
