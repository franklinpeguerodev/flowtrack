using flowtrack.DAL.context;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;

namespace flowtrack.DAL.repositories;

public class ExpenseRepository : Repository<Expense>, IExpenseRepository
{
    public ExpenseRepository(AppDbContext appDbContext) : base(appDbContext) { }

    public async Task<Expense?> GetByIdAndUserAsync(Guid id, Guid userId)
        => await _dbSet
            .Include(e => e.Category)
            .Include(e => e.PaymentMethod)
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

    public async Task<IEnumerable<Expense>> GetExpenseByPeriodAsync(Guid userId, int month, int year)
        => await _dbSet
            .Include(e => e.Category)
            .Include(e => e.PaymentMethod)
            .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
            .ToListAsync();

    public async Task<IEnumerable<Expense>> GetByCategoryAndPeriodAsync(Guid userId, Guid categoryId, int month, int year)
        => await _dbSet
            .Where(e => e.UserId == userId && e.CategoryId == categoryId
                     && e.Date.Month == month && e.Date.Year == year)
            .ToListAsync();
    public async Task<IEnumerable<Expense>> GetAllByUserWithDetailsAsync(Guid userId)
        => await _dbSet
            .Include(e => e.Category)
            .Include(e => e.PaymentMethod)
            .Where(e => e.UserId == userId)
            .ToListAsync();

    public async Task<bool> PaymentMethodExpenseExistingAsync(Guid paymentMethodId)
        => await _dbSet.AnyAsync(e => e.PaymentMethodId == paymentMethodId);
}