namespace Car_Colour_Project.Services;

public interface IImageRecolorService
{
    Task<string> RecolorAsync(string carId, string sourceRelativePath, string hexColor, CancellationToken cancellationToken = default);
}
