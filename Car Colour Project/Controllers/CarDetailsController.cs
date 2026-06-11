using Car_Colour_Project.Models;
using Car_Colour_Project.Services;
using Microsoft.AspNetCore.Mvc;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/car-details")]
public sealed class CarDetailsController : ControllerBase
{
    private readonly ICarDetailsRepository _carDetailsRepository;

    public CarDetailsController(ICarDetailsRepository carDetailsRepository)
    {
        _carDetailsRepository = carDetailsRepository;
    }

    [HttpGet("{carId}")]
    public async Task<IActionResult> GetByCarId(string carId, CancellationToken cancellationToken)
    {
        var sections = await _carDetailsRepository.GetByCarIdAsync(carId, cancellationToken);
        return Ok(sections);
    }

    [HttpPost("{carId}")]
    public async Task<IActionResult> SaveByCarId(string carId, [FromBody] List<CarDetailSection> sections, CancellationToken cancellationToken)
    {
        await _carDetailsRepository.SaveByCarIdAsync(carId, sections ?? [], cancellationToken);
        return Ok(new { success = true });
    }
}
