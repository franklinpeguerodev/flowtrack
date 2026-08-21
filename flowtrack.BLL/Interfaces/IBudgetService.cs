using flowtrack.BLL.DTOs.Budget;

namespace flowtrack.BLL.Interfaces;
public interface IBudgetService
{
    Task<BudgetResponseDto> CreateAsync (Guid userId,BudgetCreateDto dto);
    Task<BudgetResponseDto> UpdateAsync (Guid userId,Guid budgetId, BudgetUpdateDto dto);
    Task DeleteAsync (Guid userId,Guid budgetId);
    Task<IEnumerable<BudgetResponseDto>> GetAllAsync (Guid userId);
    Task<BudgetResponseDto> GetByIdAsync (Guid userId,Guid budgetId);
}