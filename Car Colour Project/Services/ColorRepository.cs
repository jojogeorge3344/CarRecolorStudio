using Car_Colour_Project.Models;

namespace Car_Colour_Project.Services;

public sealed class ColorRepository : IColorRepository
{
    private static readonly string[] Categories =
    [
        "Red", "Blue", "Green", "Yellow", "White", "Black", "Grey", "Silver", "Metallic", "Matte", "Pearl", "Custom"
    ];

    private readonly JsonDataLoader _dataLoader;
    private readonly SemaphoreSlim _syncLock = new(1, 1);
    private IReadOnlyList<ColorInfo>? _cache;

    public ColorRepository(JsonDataLoader dataLoader)
    {
        _dataLoader = dataLoader;
    }

    public async Task<IReadOnlyList<ColorInfo>> GetAllAsync(CancellationToken cancellationToken = default)
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
                var colors = (await _dataLoader.LoadListAsync<ColorInfo>(Path.Combine("data", "colors.json"), cancellationToken)).ToList();
                if (colors.Count < 1000)
                {
                    colors.AddRange(BuildGeneratedColors(colors));
                }

                _cache = colors
                    .DistinctBy(c => c.Hex.ToUpperInvariant())
                    .OrderBy(c => c.Name)
                    .ToList();
            }

            return _cache;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    public async Task<IReadOnlyList<ColorInfo>> SearchAsync(string term, CancellationToken cancellationToken = default)
    {
        var colors = await GetAllAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(term))
        {
            return colors;
        }

        return colors
            .Where(c => c.Name.Contains(term, StringComparison.OrdinalIgnoreCase)
                || c.Hex.Contains(term, StringComparison.OrdinalIgnoreCase)
                || c.Category.Contains(term, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    private static IEnumerable<ColorInfo> BuildGeneratedColors(IReadOnlyCollection<ColorInfo> existing)
    {
        var existingHex = existing.Select(c => c.Hex.ToUpperInvariant()).ToHashSet(StringComparer.OrdinalIgnoreCase);

        var list = new List<ColorInfo>();
        for (var r = 0; r <= 255; r += 16)
        {
            for (var g = 0; g <= 255; g += 16)
            {
                for (var b = 0; b <= 255; b += 16)
                {
                    var hex = $"#{r:X2}{g:X2}{b:X2}";
                    if (existingHex.Contains(hex))
                    {
                        continue;
                    }

                    list.Add(new ColorInfo
                    {
                        Name = $"Generated {hex}",
                        Hex = hex,
                        Category = DetermineCategory(r, g, b)
                    });

                    if (list.Count + existing.Count >= 1200)
                    {
                        return list;
                    }
                }
            }
        }

        return list;
    }

    private static string DetermineCategory(int r, int g, int b)
    {
        if (r > 220 && g > 220 && b > 220) return "White";
        if (r < 40 && g < 40 && b < 40) return "Black";
        if (Math.Abs(r - g) < 12 && Math.Abs(g - b) < 12) return "Grey";
        if (r > g && r > b) return "Red";
        if (g > r && g > b) return "Green";
        if (b > r && b > g) return "Blue";
        if (r > 180 && g > 180 && b < 120) return "Yellow";
        return Categories[(r + g + b) % Categories.Length];
    }
}
