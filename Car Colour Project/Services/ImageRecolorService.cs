using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Car_Colour_Project.Services;

public sealed class ImageRecolorService : IImageRecolorService
{
    private readonly IWebHostEnvironment _environment;

    public ImageRecolorService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> RecolorAsync(string carId, string sourceRelativePath, string hexColor, CancellationToken cancellationToken = default)
    {
        var sourcePath = Path.Combine(_environment.WebRootPath, sourceRelativePath.Replace('/', Path.DirectorySeparatorChar));
        if (!File.Exists(sourcePath))
        {
            throw new FileNotFoundException($"Source image not found: {sourceRelativePath}");
        }

        var generatedFolder = Path.Combine(_environment.WebRootPath, "generated");
        Directory.CreateDirectory(generatedFolder);

        var outputFile = $"{Sanitize(carId)}-{hexColor.TrimStart('#').ToLowerInvariant()}.png";
        var outputPath = Path.Combine(generatedFolder, outputFile);

        var target = ParseHex(hexColor);

        Image<Rgba32> image;
        try
        {
            image = await Image.LoadAsync<Rgba32>(sourcePath, cancellationToken);
        }
        catch (Exception ex) when (ex.Message.Contains("decoder", StringComparison.OrdinalIgnoreCase)
                                || ex.Message.Contains("not supported", StringComparison.OrdinalIgnoreCase)
                                || ex is InvalidImageContentException or UnknownImageFormatException)
        {
            var ext = Path.GetExtension(sourcePath);
            throw new InvalidOperationException(
                $"Image format '{ext}' is not supported for recolouring. " +
                "Please use PNG, JPG, WebP, BMP, TIFF, or GIF. " +
                "AVIF and HEIC formats are not supported — convert the image first.", ex);
        }

        using (image)
        {
            using var maskImage = await TryLoadMaskAsync(carId, sourcePath, image.Width, image.Height, cancellationToken);

            // If a hand-crafted mask exists, use it pixel-by-pixel.
            // Otherwise fall back to the built-in auto-mask so every car works
            // without requiring a manual mask file.
            if (maskImage is not null)
            {
                ApplyRecolorWithMask(image, maskImage, target);
            }
            else
            {
                var autoWeights = BuildAutoMaskWeights(image);
                ApplyRecolorWithWeights(image, autoWeights, target);
            }

            await image.SaveAsPngAsync(outputPath, cancellationToken);
        }

        return $"/generated/{outputFile}";
    }

    // ── Recolor using a pre-loaded grayscale mask image ──────────────────────
    private static void ApplyRecolorWithMask(Image<Rgba32> image, Image<L8> mask, Rgba32 target)
    {
        image.ProcessPixelRows(accessor =>
        {
            for (var y = 0; y < accessor.Height; y++)
            {
                var row = accessor.GetRowSpan(y);
                for (var x = 0; x < row.Length; x++)
                {
                    var pixel = row[x];
                    if (pixel.A < 10) continue;

                    var (_, s, v) = RgbToHsv(pixel.R, pixel.G, pixel.B);
                    var maskWeight = GetMaskWeight(mask[x, y]);
                    if (maskWeight <= 0f) continue;

                    var blend = Math.Clamp((0.60f + (s * 0.30f)) * maskWeight, 0f, 0.94f);
                    row[x] = BlendPixel(pixel, target, v, blend);
                }
            }
        });
    }

    // ── Recolor using auto-computed weight array ──────────────────────────────
    private static void ApplyRecolorWithWeights(Image<Rgba32> image, float[] weights, Rgba32 target)
    {
        var width = image.Width;
        image.ProcessPixelRows(accessor =>
        {
            for (var y = 0; y < accessor.Height; y++)
            {
                var row = accessor.GetRowSpan(y);
                for (var x = 0; x < row.Length; x++)
                {
                    var pixel = row[x];
                    if (pixel.A < 10) continue;

                    var maskWeight = weights[(y * width) + x];
                    if (maskWeight <= 0f) continue;

                    var (_, s, v) = RgbToHsv(pixel.R, pixel.G, pixel.B);
                    var blend = Math.Clamp((0.60f + (s * 0.30f)) * maskWeight, 0f, 0.94f);
                    row[x] = BlendPixel(pixel, target, v, blend);
                }
            }
        });
    }

    private static Rgba32 BlendPixel(Rgba32 pixel, Rgba32 target, float v, float blend)
    {
        var r = (byte)Math.Clamp((target.R * v) * blend + pixel.R * (1f - blend), 0, 255);
        var g = (byte)Math.Clamp((target.G * v) * blend + pixel.G * (1f - blend), 0, 255);
        var b = (byte)Math.Clamp((target.B * v) * blend + pixel.B * (1f - blend), 0, 255);
        return new Rgba32(r, g, b, pixel.A);
    }

    private async Task<Image<L8>?> TryLoadMaskAsync(string carId, string sourcePath, int width, int height, CancellationToken cancellationToken)
    {
        var fileName = Path.GetFileNameWithoutExtension(sourcePath).ToLowerInvariant();
        var maskFolder = Path.Combine(_environment.WebRootPath, "masks");

        var baseNames = new[]
        {
            carId.ToLowerInvariant(),
            Sanitize(carId).ToLowerInvariant(),
            fileName
        }.Distinct();

        foreach (var baseName in baseNames)
        {
            if (!Directory.Exists(maskFolder))
            {
                break;
            }

            var matchingFiles = Directory
                .EnumerateFiles(maskFolder, $"{baseName}.*", SearchOption.TopDirectoryOnly)
                .ToList();

            foreach (var path in matchingFiles)
            {
                var mask = await Image.LoadAsync<L8>(path, cancellationToken);
                if (mask.Width != width || mask.Height != height)
                {
                    mask.Mutate(c => c.Resize(width, height));
                }

                return mask;
            }
        }

        return null;
    }

    private static float GetMaskWeight(L8 maskPixel)
    {
        var value = maskPixel.PackedValue / 255f;
        return value < 0.15f ? 0f : value;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  AUTO-MASK  –  builds a weight map directly from the source image.
    //
    //  Phase 1 – DetectDominantHue
    //    Samples every 5th pixel across the center 70 % of the image.
    //    Pixels with low saturation (greys) are ignored so that backgrounds
    //    and shadows don't pollute the result.  The raw 360-bucket hue
    //    histogram is smoothed with a ±15° rolling window and the peak
    //    is returned as the car-body hue.
    //
    //  Phase 2 – per-pixel weights
    //    Coloured car  → hue-proximity mask  (±40° tolerance, soft falloff).
    //    Neutral car   → spatial-ellipse  + luminance mask (handles
    //                    silver / grey / white / black cars).
    //    Always excluded: tyre-black (v<0.12), specular highlights
    //    (v>0.97 && s<0.05), sky strip (top 8 %), ground strip (bottom 8 %).
    //
    //  Phase 3 – SmoothWeights (2-pass separable box-blur, radius 3)
    //    Feathers mask edges so colour blends naturally at panel boundaries.
    // ─────────────────────────────────────────────────────────────────────────
    private static float[] BuildAutoMaskWeights(Image<Rgba32> image)
    {
        var width  = image.Width;
        var height = image.Height;
        var weights = new float[width * height];

        // ── Phase 1: find dominant body hue ──────────────────────────────────
        var (dominantHue, hasDominantHue) = DetectDominantHue(image, width, height);

        // ── Phase 2: per-pixel weight ─────────────────────────────────────────
        for (var y = 0; y < height; y++)
        {
            var ny = y / (float)height;

            // Exclude sky (top) and ground (bottom) strips
            if (ny < 0.08f || ny > 0.92f) continue;

            for (var x = 0; x < width; x++)
            {
                var idx   = (y * width) + x;
                var pixel = image[x, y];
                if (pixel.A < 10) continue;

                var (h, s, v) = RgbToHsv(pixel.R, pixel.G, pixel.B);

                // Always exclude: tyre-black / window-dark
                if (v < 0.12f) continue;
                // Always exclude: blown specular highlights (chrome, sky reflections)
                if (v > 0.97f && s < 0.05f) continue;

                if (hasDominantHue)
                {
                    // ── Coloured car: hue-proximity mask ─────────────────────
                    const float HueRange = 40f;            // ± 40° tolerance
                    var hueDiff = HueDiff(h, dominantHue);
                    if (hueDiff > HueRange) continue;

                    // Soft weight: peaks at dominant hue, falls off to edge of range.
                    // Also boosted by saturation so reflections/shadows contribute less.
                    var hueScore = 1f - (hueDiff / HueRange);
                    var satScore = Math.Clamp((s - 0.08f) / 0.35f, 0f, 1f);
                    weights[idx] = hueScore * (0.45f + satScore * 0.55f);
                }
                else
                {
                    // ── Neutral / grey / silver car: spatial + luminance mask ─
                    var nx = x / (float)width;

                    // Elliptical region – car body typically occupies center area
                    var dx = (nx - 0.50f) / 0.47f;
                    var dy = (ny - 0.54f) / 0.36f;
                    if ((dx * dx) + (dy * dy) > 1.0f) continue;

                    // Skip near-black shadows and very bright blown areas
                    if (v < 0.20f || v > 0.93f) continue;

                    // Weight by brightness (mid-range = car panel, not shadow/highlight)
                    weights[idx] = Math.Clamp((v - 0.20f) / 0.50f, 0.2f, 1f) * 0.85f;
                }
            }
        }

        // ── Phase 3: smooth mask edges (separable box-blur) ───────────────────
        SmoothWeights(weights, width, height, radius: 3);

        return weights;
    }

    // ── Dominant hue detection ────────────────────────────────────────────────
    private static (float Hue, bool Found) DetectDominantHue(Image<Rgba32> image, int width, int height)
    {
        var xMin = (int)(width  * 0.15f);
        var xMax = (int)(width  * 0.85f);
        var yMin = (int)(height * 0.20f);
        var yMax = (int)(height * 0.80f);

        const int Stride = 5;           // sample every 5th pixel
        var hueBuckets    = new float[360];
        var totalWeighted = 0f;
        var coloredPixels = 0;

        for (var y = yMin; y < yMax; y += Stride)
        {
            for (var x = xMin; x < xMax; x += Stride)
            {
                var pixel = image[x, y];
                if (pixel.A < 20) continue;

                var (h, s, v) = RgbToHsv(pixel.R, pixel.G, pixel.B);

                // Ignore neutrals (grey / black / white) – they blur the hue signal
                if (s < 0.15f || v < 0.12f || v > 0.97f) continue;

                // Weight contribution by saturation (vivid colours matter more)
                var bucket = (int)h % 360;
                hueBuckets[bucket] += s;
                totalWeighted += s;
                coloredPixels++;
            }
        }

        // Not enough coloured pixels → neutral / grey car, no dominant hue
        if (coloredPixels < 25 || totalWeighted < 4f) return (0f, false);

        // Smooth hue histogram with a ±15° rolling window to merge nearby hues
        var smoothed = new float[360];
        for (var i = 0; i < 360; i++)
        {
            float sum = 0f;
            for (var d = -15; d <= 15; d++)
                sum += hueBuckets[(i + d + 360) % 360];
            smoothed[i] = sum;
        }

        // Find peak
        var maxVal = 0f;
        var maxIdx = 0;
        for (var i = 0; i < 360; i++)
        {
            if (smoothed[i] > maxVal) { maxVal = smoothed[i]; maxIdx = i; }
        }

        // Accept only if the dominant hue is clearly the majority (>18 % of weighted total)
        if (maxVal < totalWeighted * 0.18f) return (0f, false);

        return (maxIdx, true);
    }

    // ── Circular hue distance (0–180°) ───────────────────────────────────────
    private static float HueDiff(float h1, float h2)
    {
        var diff = Math.Abs(h1 - h2);
        return Math.Min(diff, 360f - diff);
    }

    // ── Separable box-blur on the float weight map ────────────────────────────
    private static void SmoothWeights(float[] weights, int width, int height, int radius)
    {
        var temp = new float[weights.Length];

        // Horizontal pass
        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                float sum  = 0f;
                int   cnt  = 0;
                for (var dx = -radius; dx <= radius; dx++)
                {
                    var nx = x + dx;
                    if (nx < 0 || nx >= width) continue;
                    sum += weights[(y * width) + nx];
                    cnt++;
                }
                temp[(y * width) + x] = cnt > 0 ? sum / cnt : 0f;
            }
        }

        // Vertical pass (read from temp, write back to weights)
        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                float sum  = 0f;
                int   cnt  = 0;
                for (var dy = -radius; dy <= radius; dy++)
                {
                    var ny = y + dy;
                    if (ny < 0 || ny >= height) continue;
                    sum += temp[(ny * width) + x];
                    cnt++;
                }
                weights[(y * width) + x] = cnt > 0 ? sum / cnt : 0f;
            }
        }
    }

    private static string Sanitize(string input)
    {
        var safeChars = input.Where(char.IsLetterOrDigit).ToArray();
        return safeChars.Length == 0 ? "car" : new string(safeChars);
    }

    private static Rgba32 ParseHex(string hex)
    {
        hex = hex.Trim();
        if (!hex.StartsWith('#'))
        {
            throw new ArgumentException("HEX must start with #", nameof(hex));
        }

        var value = hex[1..];
        if (value.Length == 3)
        {
            value = string.Concat(value.Select(c => $"{c}{c}"));
        }

        if (value.Length != 6)
        {
            throw new ArgumentException("HEX must be #RGB or #RRGGBB", nameof(hex));
        }

        var r = Convert.ToByte(value[..2], 16);
        var g = Convert.ToByte(value.Substring(2, 2), 16);
        var b = Convert.ToByte(value.Substring(4, 2), 16);

        return new Rgba32(r, g, b);
    }

    private static (float h, float s, float v) RgbToHsv(byte r, byte g, byte b)
    {
        var rf = r / 255f;
        var gf = g / 255f;
        var bf = b / 255f;

        var max = Math.Max(rf, Math.Max(gf, bf));
        var min = Math.Min(rf, Math.Min(gf, bf));
        var delta = max - min;

        var h = 0f;
        if (delta > 0)
        {
            if (max == rf)
            {
                h = 60f * (((gf - bf) / delta) % 6f);
            }
            else if (max == gf)
            {
                h = 60f * (((bf - rf) / delta) + 2f);
            }
            else
            {
                h = 60f * (((rf - gf) / delta) + 4f);
            }
        }

        if (h < 0)
        {
            h += 360f;
        }

        var s = max == 0 ? 0 : delta / max;
        var v = max;
        return (h, s, v);
    }
}
