using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using flowtrack.BLL.Enums;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Models;

namespace flowtrack.BLL.Services.Export;

public class JsonReportExporter : IReportExporter
{
    public ExportFormat Format => ExportFormat.Json;
    public string ContentType => "application/json";
    public string FileExtension => ".json";

    public byte[] Export(MonthlyReportData report)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };
        var json = JsonSerializer.Serialize(report, options);
        return Encoding.UTF8.GetBytes(json);
    }
}