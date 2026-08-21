namespace flowtrack.BLL.DTOs.Expense;

public record ExpenseUpdateDto
{
    public decimal Amount { get; init; }
    public DateTime Date { get; init; }
    public string? Description { get; init; }
    public Guid CategoryId { get; init; }
    public Guid PaymentMethodId { get; init; }
}