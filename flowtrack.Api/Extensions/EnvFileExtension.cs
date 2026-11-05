using flowtrack.DAL.Extensions;
using Microsoft.Extensions.Configuration.Memory;

namespace flowtrack.Api.Extensions;

/// <summary>
/// Carga un archivo <c>.env</c> (opcional) en la configuración de la API.
///
/// Precedencia resultante (de mayor a menor):
///   1. Variables de entorno del proceso / del sistema.
///   2. Archivo <c>.env</c>.
///   3. <c>appsettings.json</c> y <c>appsettings.{Environment}.json</c>.
///
/// En el archivo <c>.env</c> se usa el formato habitual de .NET, donde <c>__</c> (doble guion bajo)
/// equivale a <c>:</c> en la ruta de configuración. Ejemplos:
///   ConnectionStrings__Default=server=localhost;port=3306;database=flowtrack;Uid=root;Pwd=secreto
///   Jwt__key=una-clave-secreta-larga-y-aleatoria
/// </summary>
public static class EnvFileExtension
{
    public const string DefaultFileName = EnvFile.DefaultFileName;

    public static IConfigurationBuilder AddEnvFile(this IConfigurationBuilder builder, string? filePath = null)
    {
        var path = filePath ?? EnvFile.ResolvePath();
        if (path is null || !File.Exists(path))
            return builder;

        var data = EnvFile.ParseFile(path);

        // Las variables de entorno reales tienen prioridad: si la clave ya está definida
        // en el entorno, no se agrega desde el .env (así el .env no las pisa).
        var effective = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
        foreach (var (key, value) in data)
        {
            var environmentName = key.Replace(":", "__");
            if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable(environmentName)))
                continue;

            effective[key] = value;
        }

        if (effective.Count > 0)
            builder.AddInMemoryCollection(effective);

        return builder;
    }
}
