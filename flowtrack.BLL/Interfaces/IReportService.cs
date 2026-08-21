using flowtrack.BLL.DTOs.File;

namespace flowtrack.BLL.Interfaces;

public interface IReportExportService
{
    Task<ExportedFileDto> ExportAsync(Guid userId, ReportExportRequestDto request);
}