using Car_Colour_Project.Models;

namespace Car_Colour_Project.Repository;

public interface IColorRepository
{
    Task<IReadOnlyList<ColorInfo>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ColorInfo>> SearchAsync(string term, CancellationToken cancellationToken = default);
}
