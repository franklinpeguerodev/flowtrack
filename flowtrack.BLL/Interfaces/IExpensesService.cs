using flowtrack.BLL.DTOs;
using flowtrack.BLL.DTOs.Expense;

namespace flowtrack.BLL.Interfaces;

public interface IExpenseService
{
    Task<ExpenseResponseDto> CreateAsync(Guid userId, ExpenseCreateDto dto);
    Task<ExpenseResponseDto> UpdateAsync(Guid userId, Guid expenseId, ExpenseUpdateDto dto);
    Task DeleteAsync(Guid userId, Guid expenseId);
    Task<IEnumerable<ExpenseResponseDto>> GetAllAsync(Guid userId);
    Task<ExpenseResponseDto> GetByIdAsync(Guid userId, Guid expenseId);
}