namespace flowtrack.BLL.DTOs.Budget;
public record BudgetResponseDto
{
    public Guid Id {get;init;}
    public Guid CategoryId {get;init;}
    public decimal Amount {get;init;}
    public int Month {get;init;}
    public int Year {get;init;}
    public DateTime CreatedAt {get;init;}

}