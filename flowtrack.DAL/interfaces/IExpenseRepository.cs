using flowtrack.Entities;

namespace flowtrack.DAL.interfaces;
public interface IExpenseRepository : IRepository<Expense>
{

    Task<Expense?> GetByIdAndUserAsync(Guid id, Guid userId);
    Task<IEnumerable<Expense>> GetExpenseByPeriodAsync (Guid userId,int month , int year);
    Task<IEnumerable<Expense>> GetAllByUserWithDetailsAsync(Guid userId);
     Task<IEnumerable<Expense>> GetByCategoryAndPeriodAsync(Guid userId, Guid categoryId, int month, int year);
    Task<bool> PaymentMethodExpenseExistingAsync(Guid paymentMethodId);
}