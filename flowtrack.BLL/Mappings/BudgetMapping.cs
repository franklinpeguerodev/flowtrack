using flowtrack.BLL.DTOs.Budget;
using flowtrack.Entities;

namespace flowtrack.BLL.Mappings;
public static class BudgetMapping
{
    public static BudgetResponseDto ToDto (this Budget budget) => new ()
    {
        Id=budget.Id,
        CategoryId=budget.CategoryId,
        Amount=budget.Amount,
        Month=budget.Month,
        Year=budget.Year,
        CreatedAt=budget.CreatedAt
    };
}