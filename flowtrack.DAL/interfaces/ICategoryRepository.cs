using flowtrack.Entities;

namespace flowtrack.DAL.interfaces;
public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetByIdAndUserAsync (Guid id, Guid userId);
    Task<bool> ExpenseExistingAsync(Guid categoryID); 
    Task<Category?> IsDuplicateNameAsync(Guid userId, string name, Guid? excludeId = null);
}
