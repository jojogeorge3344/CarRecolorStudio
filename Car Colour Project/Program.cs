using System.Net.NetworkInformation;
using Car_Colour_Project.Services;
using Car_Colour_Project.Repository;

var builder = WebApplication.CreateBuilder(args);

ConfigureApplicationUrls(builder);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<JsonDataLoader>();
builder.Services.AddSingleton<ICarRepository, CarRepository>();
builder.Services.AddSingleton<IColorRepository, ColorRepository>();
builder.Services.AddSingleton<ICarDetailsRepository, CarDetailsRepository>();
builder.Services.AddSingleton<IUserRepository, UserRepository>();
builder.Services.AddSingleton<ICarService, CarService>();
builder.Services.AddSingleton<IColorService, ColorService>();
builder.Services.AddSingleton<ICarDetailsService, CarDetailsService>();
builder.Services.AddSingleton<IUserService, UserService>();
builder.Services.AddScoped<IImageRecolorService, ImageRecolorService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/index.html"));

app.Run();

static void ConfigureApplicationUrls(WebApplicationBuilder builder)
{
    var configuredUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS")
        ?? builder.Configuration["Urls"];

    if (string.IsNullOrWhiteSpace(configuredUrls))
    {
        return;
    }

    var occupiedPorts = IPGlobalProperties.GetIPGlobalProperties()
        .GetActiveTcpListeners()
        .Select(endpoint => endpoint.Port)
        .ToHashSet();

    var resolvedUrls = configuredUrls
        .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        .Select(url => ResolveAvailableUrl(url, occupiedPorts))
        .ToArray();

    builder.WebHost.UseUrls(resolvedUrls);
}

static string ResolveAvailableUrl(string url, HashSet<int> occupiedPorts)
{
    if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) || uri.Port <= 0)
    {
        return url;
    }

    if (!occupiedPorts.Contains(uri.Port))
    {
        occupiedPorts.Add(uri.Port);
        return url;
    }

    var fallbackPort = GetNextFreePort(occupiedPorts, uri.Port + 1);
    occupiedPorts.Add(fallbackPort);

    return $"{uri.Scheme}://{uri.Host}:{fallbackPort}";
}

static int GetNextFreePort(HashSet<int> occupiedPorts, int startPort)
{
    for (var port = startPort; port <= 65535; port++)
    {
        if (!occupiedPorts.Contains(port))
        {
            return port;
        }
    }

    throw new InvalidOperationException("No free TCP port is available for startup.");
}
