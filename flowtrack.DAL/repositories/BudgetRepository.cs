using flowtrack.DAL.context;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;

namespace flowtrack.DAL.repositories;

public class BudgetRepository : Repository<Budget>, IBudgetRepository
{
    public BudgetRepository(AppDbContext appDbContext): base(appDbContext){}
    public async Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId, int month, int year)
    => await _dbSet
    .Where(b=>b.UserId ==userId && b.Month == month && b.Year == year)
    .ToListAsync();
    public async Task<Budget?> GetByIdAndUserAsync (Guid id, Guid userId)
    => await _dbSet.FirstOrDefaultAsync(b=> b.Id == id && b.UserId== userId );

    public async Task<IEnumerable<Budget>> GetCategoryAsync(Guid categoryId)
    => await _dbSet.Where(c=> c.CategoryId == categoryId).ToListAsync();

    public async Task<Budget?> IsDuplicateBudget(Guid userId, Guid categoryId, int month, int year)
   => await _dbSet.FirstOrDefaultAsync(b=> b.UserId == userId && b.CategoryId == categoryId && b.Month==month && b.Year == year);
}