using System.Linq.Expressions;

namespace flowtrack.DAL.interfaces;
public interface IRepository<T> where T :class
{
    Task CreateAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync (T entity);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T,bool>>predicate);
    Task<bool> SaveChangesAsync();
}