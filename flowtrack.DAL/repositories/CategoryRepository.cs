using flowtrack.DAL.context;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;

namespace flowtrack.DAL.repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    private readonly IExpenseRepository _expenseRepository;
    public CategoryRepository(AppDbContext appDbContext,IExpenseRepository expenseRepository) : base(appDbContext)
    {
        _expenseRepository=expenseRepository;
    }
    

    public async Task<bool> ExpenseExistingAsync(Guid categoryID)
    {
        var expenses= await _expenseRepository.FindAsync(e=> e.CategoryId==categoryID);
        return expenses.Any();
    }

    public async Task<Category?> IsDuplicateNameAsync(Guid userId,string name, Guid? excludeId = null)
    {
        var query = _dbSet.Where(c => c.UserId == userId && c.Name == name);
        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);
        return await query.FirstOrDefaultAsync();
    }
    
    public async Task<Category?> GetByIdAndUserAsync (Guid id, Guid userId)
    => await _dbSet.FirstOrDefaultAsync(c=> c.Id == id && c.UserId== userId );
}