using Car_Colour_Project.Models;
using Car_Colour_Project.Services;
using Microsoft.AspNetCore.Mvc;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class RecolorController : ControllerBase
{
    private readonly ICarRepository _carRepository;
    private readonly IImageRecolorService _imageRecolorService;

    public RecolorController(ICarRepository carRepository, IImageRecolorService imageRecolorService)
    {
        _carRepository = carRepository;
        _imageRecolorService = imageRecolorService;
    }

    [HttpPost]
    public async Task<ActionResult<RecolorResponse>> Recolor([FromBody] RecolorRequest request, CancellationToken cancellationToken)
    {
        var car = await _carRepository.GetByIdAsync(request.CarId, cancellationToken);
        if (car is null)
        {
            return NotFound(new RecolorResponse { Success = false, Message = "Car not found." });
        }

        try
        {
            var imageUrl = await _imageRecolorService.RecolorAsync(car.Id, car.Image, request.HexColor, cancellationToken);
            return Ok(new RecolorResponse { Success = true, ImageUrl = imageUrl });
        }
        catch (Exception ex)
        {
            return BadRequest(new RecolorResponse { Success = false, Message = ex.Message });
        }
    }
}
