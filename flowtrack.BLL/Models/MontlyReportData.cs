namespace flowtrack.BLL.Models;

public class MonthlyReportData
{
    public int Month { get; init; }
    public int Year { get; init; }
    public decimal TotalAmount { get; init; }
    public List<CategoryBreakdownData> CategoryBreakdown { get; init; } = [];
    public List<ExpenseReportLine> Expenses { get; init; } = [];   // <-- corregido
}