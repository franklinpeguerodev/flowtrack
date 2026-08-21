namespace flowtrack.BLL.DTOs.Budget;
public record BudgetCreateDto{
    public Guid CategoryId {get;init;}
    public decimal Amount {get;init;}
    public int Month {get;init;}
    public int Year {get;init;}
}