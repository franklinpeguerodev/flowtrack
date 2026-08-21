using flowtrack.BLL.DTOs.Expense;
using flowtrack.Entities;

namespace flowtrack.BLL.Mappings;

public static class ExpenseMapping
{
    public static ExpenseResponseDto ToDto(this Expense expense) => new()
    {
        Id = expense.Id,
        Amount = expense.Amount,
        Date = expense.Date,
        Description = expense.Description,
        CategoryId = expense.CategoryId,
        CategoryName = expense.Category?.Name ?? string.Empty,
        PaymentMethodId = expense.PaymentMethodId,
        PaymentMethodName = expense.PaymentMethod?.Name ?? string.Empty,
        CreatedAt = expense.CreatedAt
    };
}