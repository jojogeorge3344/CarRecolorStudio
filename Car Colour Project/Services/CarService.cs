using Car_Colour_Project.Models;
using Car_Colour_Project.Repository;

namespace Car_Colour_Project.Services;

public sealed class CarService : ICarService
{
    private readonly ICarRepository _carRepository;

    public CarService(ICarRepository carRepository)
    {
        _carRepository = carRepository;
    }

    public Task<IReadOnlyList<Car>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return _carRepository.GetAllAsync(cancellationToken);
    }

    public Task<IReadOnlyList<Car>> SearchAsync(string term, CancellationToken cancellationToken = default)
    {
        return _carRepository.SearchAsync(term, cancellationToken);
    }

    public Task<Car?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return _carRepository.GetByIdAsync(id, cancellationToken);
    }

    public Task<Car> AddAsync(Car car, CancellationToken cancellationToken = default)
    {
        return _carRepository.AddAsync(car, cancellationToken);
    }

    public Task<Car?> UpdateImageAsync(string id, string imageRelativePath, CancellationToken cancellationToken = default)
    {
        return _carRepository.UpdateImageAsync(id, imageRelativePath, cancellationToken);
    }

    public Task<Car?> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        return _carRepository.DeleteAsync(id, cancellationToken);
    }
}
