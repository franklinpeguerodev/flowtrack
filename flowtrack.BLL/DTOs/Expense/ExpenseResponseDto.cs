namespace flowtrack.BLL.DTOs.Expense;

public record ExpenseResponseDto
{
    public Guid Id { get; init; }
    public decimal Amount { get; init; }
    public DateTime Date { get; init; }
    public string? Description { get; init; }
    public Guid CategoryId { get; init; }
    public string CategoryName { get; init; } = string.Empty;
    public Guid PaymentMethodId { get; init; }
    public string PaymentMethodName { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}