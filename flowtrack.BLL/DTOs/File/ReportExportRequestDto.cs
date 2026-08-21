using flowtrack.BLL.Enums;

namespace flowtrack.BLL.DTOs.File;
public record ReportExportRequestDto
{
    public int Month{get;init;}
     public int Year{get;init;}
     public ExportFormat Format{get;init;}
}