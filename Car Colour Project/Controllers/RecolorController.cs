using Car_Colour_Project.Models;
using Car_Colour_Project.Services;
using Microsoft.AspNetCore.Mvc;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class RecolorController : ControllerBase
{
    private readonly ICarService _carService;
    private readonly IImageRecolorService _imageRecolorService;

    public RecolorController(ICarService carService, IImageRecolorService imageRecolorService)
    {
        _carService = carService;
        _imageRecolorService = imageRecolorService;
    }

    [HttpPost]
    public async Task<ActionResult<RecolorResponse>> Recolor([FromBody] RecolorRequest request, CancellationToken cancellationToken)
    {
        var car = await _carService.GetByIdAsync(request.CarId, cancellationToken);
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
