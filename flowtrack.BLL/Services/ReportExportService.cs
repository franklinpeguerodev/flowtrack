using flowtrack.BLL.DTOs.File;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Helpers;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Models;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;

namespace flowtrack.BLL.Services;

public class ReportExportService : IReportExportService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly Dictionary<Enums.ExportFormat, IReportExporter> _exporters;

    public ReportExportService(IExpenseRepository expenseRepository, IEnumerable<IReportExporter> exporters)
    {
        _expenseRepository = expenseRepository;
        _exporters = exporters.ToDictionary(e => e.Format);
    }

    public async Task<ExportedFileDto> ExportAsync(Guid userId, ReportExportRequestDto request)
    {
        PeriodValidator.Validate(request.Month, request.Year);

        if (!_exporters.TryGetValue(request.Format, out var exporter))
            throw new BusinessRuleException("Formato de exportación no soportado.");

        var expenses = await _expenseRepository.GetExpenseByPeriodAsync(userId, request.Month, request.Year);
        var reportData = BuildReportData(request.Month, request.Year, expenses);

        var bytes = exporter.Export(reportData);

        return new ExportedFileDto
        {
            Content = bytes,
            ContentType = exporter.ContentType,
            FileName = $"reporte-{request.Month}-{request.Year}{exporter.FileExtension}"
        };
    }

    private static MonthlyReportData BuildReportData(int month, int year, IEnumerable<Expense> expenses)
    {
        var list = expenses.ToList();

        var breakdown = list
            .GroupBy(e => e.Category?.Name ?? "Sin categoría")
            .Select(g => new CategoryBreakdownData
            {
                CategoryName = g.Key,
                Total = g.Sum(e => e.Amount),
                Count = g.Count()
            })
            .OrderByDescending(b => b.Total)
            .ToList();

        return new MonthlyReportData
        {
            Month = month,
            Year = year,
            TotalAmount = list.Sum(e => e.Amount),
            CategoryBreakdown = breakdown,
            Expenses = list.Select(e => new ExpenseReportLine
            {
                Date = e.Date,
                Amount = e.Amount,
                Description = e.Description,
                CategoryName = e.Category?.Name ?? "Sin categoría",
                PaymentMethodName = e.PaymentMethod?.Name ?? "Desconocido"
            }).ToList()
        };
    }
}