using System.Text.Json.Serialization;

namespace flowtrack.BLL.Enums;
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ExportFormat{
    Json,
    Txt,
    Excel
}