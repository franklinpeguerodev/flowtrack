using ClosedXML.Excel;
using flowtrack.BLL.Enums;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Models;

namespace flowtrack.BLL.Services.Export;

public class ExcelReportExporter : IReportExporter
{
    public ExportFormat Format => ExportFormat.Excel;
    public string ContentType => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public string FileExtension => ".xlsx";

    public byte[] Export(MonthlyReportData report)
    {
        using var workbook = new XLWorkbook();

        var summary = workbook.Worksheets.Add("Resumen");
        summary.Cell(1, 1).Value = "Categoría";
        summary.Cell(1, 2).Value = "Total";
        summary.Cell(1, 3).Value = "Cantidad";
        summary.Range(1, 1, 1, 3).Style.Font.Bold = true;

        int row = 2;
        foreach (var c in report.CategoryBreakdown)
        {
            summary.Cell(row, 1).Value = c.CategoryName;
            summary.Cell(row, 2).Value = c.Total;
            summary.Cell(row, 3).Value = c.Count;
            row++;
        }
        summary.Cell(row + 1, 1).Value = "Total";
        summary.Cell(row + 1, 2).Value = report.TotalAmount;
        summary.Range(row + 1, 1, row + 1, 2).Style.Font.Bold = true;
        summary.Columns().AdjustToContents();

        var detail = workbook.Worksheets.Add("Detalle");
        detail.Cell(1, 1).Value = "Fecha";
        detail.Cell(1, 2).Value = "Monto";
        detail.Cell(1, 3).Value = "Categoría";
        detail.Cell(1, 4).Value = "Método de pago";
        detail.Cell(1, 5).Value = "Descripción";
        detail.Range(1, 1, 1, 5).Style.Font.Bold = true;

        int drow = 2;
        foreach (var e in report.Expenses.OrderBy(x => x.Date))
        {
            detail.Cell(drow, 1).Value = e.Date;
            detail.Cell(drow, 2).Value = e.Amount;
            detail.Cell(drow, 3).Value = e.CategoryName;
            detail.Cell(drow, 4).Value = e.PaymentMethodName;
            detail.Cell(drow, 5).Value = e.Description;
            drow++;
        }
        detail.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}