using Car_Colour_Project.Models;
using Car_Colour_Project.Repository;

namespace Car_Colour_Project.Services;

public sealed class CarDetailsService : ICarDetailsService
{
    private readonly ICarDetailsRepository _carDetailsRepository;

    public CarDetailsService(ICarDetailsRepository carDetailsRepository)
    {
        _carDetailsRepository = carDetailsRepository;
    }

    public Task<IReadOnlyList<CarDetailSection>> GetByCarIdAsync(string carId, CancellationToken cancellationToken = default)
    {
        return _carDetailsRepository.GetByCarIdAsync(carId, cancellationToken);
    }

    public Task SaveByCarIdAsync(string carId, IReadOnlyList<CarDetailSection> sections, CancellationToken cancellationToken = default)
    {
        return _carDetailsRepository.SaveByCarIdAsync(carId, sections, cancellationToken);
    }

    public Task DeleteByCarIdAsync(string carId, CancellationToken cancellationToken = default)
    {
        return _carDetailsRepository.DeleteByCarIdAsync(carId, cancellationToken);
    }
}
