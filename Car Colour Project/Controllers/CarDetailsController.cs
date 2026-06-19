using Car_Colour_Project.Models;
using Car_Colour_Project.Services;
using Microsoft.AspNetCore.Mvc;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/car-details")]
public sealed class CarDetailsController : ControllerBase
{
    private readonly ICarDetailsService _carDetailsService;

    public CarDetailsController(ICarDetailsService carDetailsService)
    {
        _carDetailsService = carDetailsService;
    }

    [HttpGet("{carId}")]
    public async Task<IActionResult> GetByCarId(string carId, CancellationToken cancellationToken)
    {
        var sections = await _carDetailsService.GetByCarIdAsync(carId, cancellationToken);
        return Ok(sections);
    }

    [HttpPost("{carId}")]
    public async Task<IActionResult> SaveByCarId(string carId, [FromBody] List<CarDetailSection> sections, CancellationToken cancellationToken)
    {
        await _carDetailsService.SaveByCarIdAsync(carId, sections ?? [], cancellationToken);
        return Ok(new { success = true });
    }
}
