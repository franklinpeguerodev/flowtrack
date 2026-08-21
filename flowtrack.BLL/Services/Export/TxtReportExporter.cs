using System.Text;
using flowtrack.BLL.Enums;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Models;

namespace flowtrack.BLL.Services.Export;

public class TxtReportExporter : IReportExporter
{
    public ExportFormat Format => ExportFormat.Txt;
    public string ContentType => "text/plain";
    public string FileExtension => ".txt";

    public byte[] Export(MonthlyReportData report)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"REPORTE DE GASTOS — {report.Month}/{report.Year}");
        sb.AppendLine(new string('=', 40));
        sb.AppendLine($"Total gastado: ${report.TotalAmount:F2}");
        sb.AppendLine();

        sb.AppendLine("DESGLOSE POR CATEGORÍA");
        sb.AppendLine(new string('-', 40));
        foreach (var c in report.CategoryBreakdown)
            sb.AppendLine($"{c.CategoryName,-20} ${c.Total,10:F2}  ({c.Count} gastos)");

        sb.AppendLine();
        sb.AppendLine("DETALLE DE GASTOS");
        sb.AppendLine(new string('-', 40));
        foreach (var e in report.Expenses.OrderBy(x => x.Date))
            sb.AppendLine($"{e.Date:yyyy-MM-dd}  {e.CategoryName,-15} ${e.Amount,8:F2}  {e.PaymentMethodName,-12} {e.Description}");

        return Encoding.UTF8.GetBytes(sb.ToString());
    }
}