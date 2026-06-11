using System.Text.Json;
using Car_Colour_Project.Models;

namespace Car_Colour_Project.Services;

public sealed class CarRepository : ICarRepository
{
    private readonly JsonDataLoader _dataLoader;
    private readonly SemaphoreSlim _syncLock = new(1, 1);
    private readonly JsonSerializerOptions _serializerOptions = new() { WriteIndented = true };
    private readonly string _carsFilePath;
    private IReadOnlyList<Car>? _cache;

    public CarRepository(JsonDataLoader dataLoader, IWebHostEnvironment environment)
    {
        _dataLoader = dataLoader;
        _carsFilePath = Path.Combine(environment.ContentRootPath, "data", "cars.json");
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

    public async Task<Car> AddAsync(Car car, CancellationToken cancellationToken = default)
    {
        await _syncLock.WaitAsync(cancellationToken);
        try
        {
            _cache ??= await _dataLoader.LoadListAsync<Car>(Path.Combine("data", "cars.json"), cancellationToken);

            var cars = _cache.ToList();
            if (cars.Any(existing => string.Equals(existing.Id, car.Id, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException("A car with the same id already exists.");
            }

            cars.Add(car);
            await WriteCarsAsync(cars, cancellationToken);
            _cache = cars;

            return car;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    public async Task<Car?> UpdateImageAsync(string id, string imageRelativePath, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(imageRelativePath))
        {
            return null;
        }

        await _syncLock.WaitAsync(cancellationToken);
        try
        {
            _cache ??= await _dataLoader.LoadListAsync<Car>(Path.Combine("data", "cars.json"), cancellationToken);

            var cars = _cache.ToList();
            var index = cars.FindIndex(existing => string.Equals(existing.Id, id, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return null;
            }

            var existingCar = cars[index];
            var updatedCar = new Car
            {
                Id = existingCar.Id,
                Brand = existingCar.Brand,
                Model = existingCar.Model,
                Image = imageRelativePath
            };

            cars[index] = updatedCar;
            await WriteCarsAsync(cars, cancellationToken);
            _cache = cars;

            return updatedCar;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    public async Task<Car?> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return null;
        }

        await _syncLock.WaitAsync(cancellationToken);
        try
        {
            _cache ??= await _dataLoader.LoadListAsync<Car>(Path.Combine("data", "cars.json"), cancellationToken);

            var cars = _cache.ToList();
            var index = cars.FindIndex(existing => string.Equals(existing.Id, id, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return null;
            }

            var removed = cars[index];
            cars.RemoveAt(index);

            await WriteCarsAsync(cars, cancellationToken);
            _cache = cars;

            return removed;
        }
        finally
        {
            _syncLock.Release();
        }
    }

    private async Task WriteCarsAsync(List<Car> cars, CancellationToken cancellationToken)
    {
        var directory = Path.GetDirectoryName(_carsFilePath)!;
        Directory.CreateDirectory(directory);

        await using var stream = File.Create(_carsFilePath);
        await JsonSerializer.SerializeAsync(stream, cars, _serializerOptions, cancellationToken);
    }
}
