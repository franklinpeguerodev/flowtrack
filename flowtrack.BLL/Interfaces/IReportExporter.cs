using flowtrack.BLL.Enums;
using flowtrack.BLL.Models;

namespace flowtrack.BLL.Interfaces;
public interface IReportExporter
{
    ExportFormat Format {get;}
    string ContentType {get;}
    string FileExtension{get;}
    byte[] Export (MonthlyReportData report);
} 