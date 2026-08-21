using flowtrack.Entities;

namespace flowtrack.DAL.interfaces;
public interface IBudgetRepository : IRepository<Budget>
{
    Task<Budget?> GetByIdAndUserAsync (Guid id, Guid userId);
    Task<Budget?> IsDuplicateBudget (Guid userId,Guid categoryId,int month,int year);
    Task<IEnumerable<Budget>> GetBudgetsAsync (Guid userId,int month,int year);
    Task<IEnumerable<Budget?>> GetCategoryAsync(Guid categoryId);
}