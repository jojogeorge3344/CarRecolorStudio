using Car_Colour_Project.Services;
using Microsoft.AspNetCore.Mvc;

namespace Car_Colour_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ColorsController : ControllerBase
{
    private readonly IColorRepository _colorRepository;

    public ColorsController(IColorRepository colorRepository)
    {
        _colorRepository = colorRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var colors = await _colorRepository.GetAllAsync(cancellationToken);
        return Ok(colors);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string term, CancellationToken cancellationToken)
    {
        var colors = await _colorRepository.SearchAsync(term, cancellationToken);
        return Ok(colors);
    }
}
