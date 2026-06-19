using Car_Colour_Project.Models;
using Car_Colour_Project.Repository;

namespace Car_Colour_Project.Services;

public sealed class ColorService : IColorService
{
    private readonly IColorRepository _colorRepository;

    public ColorService(IColorRepository colorRepository)
    {
        _colorRepository = colorRepository;
    }

    public Task<IReadOnlyList<ColorInfo>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return _colorRepository.GetAllAsync(cancellationToken);
    }

    public Task<IReadOnlyList<ColorInfo>> SearchAsync(string term, CancellationToken cancellationToken = default)
    {
        return _colorRepository.SearchAsync(term, cancellationToken);
    }
}
