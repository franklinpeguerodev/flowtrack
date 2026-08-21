using flowtrack.Entities;

namespace flowtrack.DAL.interfaces;
public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetByIdAndUserAsync (Guid userId,Guid category);
    Task<bool> ExpenseExistingAsync(Guid categoryID); 
    Task<Category?> IsDuplicateNameAsync(Guid userId,string name);
}