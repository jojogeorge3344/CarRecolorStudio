using Car_Colour_Project.Models;

namespace Car_Colour_Project.Services;

public sealed class CarRepository : ICarRepository
{
    private readonly JsonDataLoader _dataLoader;
    private readonly SemaphoreSlim _syncLock = new(1, 1);
    private IReadOnlyList<Car>? _cache;

    public CarRepository(JsonDataLoader dataLoader)
    {
        _dataLoader = dataLoader;
    }

    public async Task<IReadOnlyList<Car>> GetAllAsync(CancellationToken cancellationToken = default)
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
                _cache = await _dataLoader.LoadListAsync<Car>(Path.Combine("data", "cars.json"), cancellationToken);
            }

            return _cache;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    public async Task<IReadOnlyList<Car>> SearchAsync(string term, CancellationToken cancellationToken = default)
    {
        var cars = await GetAllAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(term))
        {
            return cars;
        }

        return cars
            .Where(c => c.Brand.Contains(term, StringComparison.OrdinalIgnoreCase)
                || c.Model.Contains(term, StringComparison.OrdinalIgnoreCase)
                || $"{c.Brand} {c.Model}".Contains(term, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<Car?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return null;
        }

        var cars = await GetAllAsync(cancellationToken);
        return cars.FirstOrDefault(c => string.Equals(c.Id, id, StringComparison.OrdinalIgnoreCase));
    }
}
