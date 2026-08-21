namespace flowtrack.BLL.DTOs.File;

public record ExportedFileDto
{
    public byte[] Content { get; init; } = [];
    public string ContentType { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
}