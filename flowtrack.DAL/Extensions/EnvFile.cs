namespace flowtrack.DAL.Extensions;

/// <summary>
/// Lector de archivos <c>.env</c> compartido por la API y el factory de design-time de EF.
///
/// Formato soportado: <c>CLAVE=valor</c>, una entrada por línea. Se permiten comentarios
/// (#), el prefijo <c>export</c> y valores entre comillas. El doble guion bajo (__) equivale
/// a dos puntos (:) en la ruta de configuración, igual que en las variables de entorno de .NET.
/// </summary>
public static class EnvFile
{
    public const string DefaultFileName = ".env";

    /// <summary>
    /// Busca el archivo .env en el directorio de trabajo actual y en los directorios padre
    /// de la salida de compilación (para cubrir ".../flowtrack.Api/bin/Debug/net10.0").
    /// </summary>
    public static string? ResolvePath()
    {
        var candidates = new List<string>
        {
            Path.Combine(Directory.GetCurrentDirectory(), DefaultFileName)
        };

        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        for (var i = 0; i < 6 && directory is not null; i++)
        {
            candidates.Add(Path.Combine(directory.FullName, DefaultFileName));
            directory = directory.Parent;
        }

        return candidates.FirstOrDefault(File.Exists);
    }

    public static Dictionary<string, string?> ParseFile(string path)
    {
        var result = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

        foreach (var rawLine in File.ReadAllLines(path))
        {
            var line = rawLine.Trim();
            if (line.Length == 0 || line.StartsWith('#'))
                continue;

            if (line.StartsWith("export ", StringComparison.OrdinalIgnoreCase))
                line = line["export ".Length..].Trim();

            var separator = line.IndexOf('=');
            if (separator <= 0)
                continue;

            var key = line[..separator].Trim();
            var value = line[(separator + 1)..].Trim();

            if (key.Length == 0)
                continue;

            if (value.Length >= 2 &&
                ((value[0] == '"' && value[^1] == '"') || (value[0] == '\'' && value[^1] == '\'')))
            {
                value = value[1..^1];
            }

            result[NormalizeKey(key)] = value;
        }

        return result;
    }

    /// <summary>
    /// Devuelve la cadena de conexión priorizando: variable de entorno, luego archivo .env.
    /// </summary>
    public static string? GetConnectionString(string name = "ConnectionStrings:Default")
    {
        var fromEnvironment = Environment.GetEnvironmentVariable(name.Replace(":", "__"));
        if (!string.IsNullOrWhiteSpace(fromEnvironment))
            return fromEnvironment;

        var path = ResolvePath();
        if (path is null)
            return null;

        var values = ParseFile(path);
        return values.TryGetValue(name, out var value) ? value : null;
    }

    private static string NormalizeKey(string key) => key.Replace("__", ":");
}
