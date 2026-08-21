using flowtrack.BLL.Enums;

namespace flowtrack.BLL.DTOs.Budget;
public record BudgetStatusDto
{
    public Guid Id {get;init;}
    public Guid CategoryId {get;init;}
    public string CategoryName {get;init;} =string.Empty;
    public int Month {get;init;}
    public int Year {get;init;}
    public decimal BudgetAmount {get;init;}
    public decimal SpentAmount {get;init;}  
    public decimal PercentageUsed {get;init;}
    public BudgetAlertLevel AlertLevel {get;init;}

}