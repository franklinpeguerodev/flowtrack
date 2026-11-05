using flowtrack.DAL.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace flowtrack.DAL.context;

/// <summary>
/// Factory de design-time para que las herramientas de EF (dotnet ef) lean la misma
/// configuración que la aplicación: variable de entorno y, si no existe, el archivo .env.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = EnvFile.GetConnectionString()
            ?? throw new InvalidOperationException(
                "No se encontró la cadena de conexión. Define la variable de entorno " +
                "'ConnectionStrings__Default' o crea el archivo flowtrack.Api/.env " +
                "(ver flowtrack.Api/.env.example).");

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

        return new AppDbContext(optionsBuilder.Options);
    }
}
