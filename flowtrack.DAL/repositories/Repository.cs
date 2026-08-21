using System.Linq.Expressions;
using flowtrack.DAL.context;
using flowtrack.DAL.interfaces;
using Microsoft.EntityFrameworkCore;

namespace flowtrack.DAL.repositories;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _appDbContext;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext appDbContext)
    {
        _appDbContext=appDbContext;
        _dbSet=appDbContext.Set<T>();
    }
    public async Task CreateAsync(T entity) => await _dbSet.AddAsync(entity);

    public  Task DeleteAsync(T entity) 
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }

    public  Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask ;
    }
    public  async Task<IEnumerable<T>> GetAllAsync()  => await _dbSet.ToListAsync();
    public async Task<T?> GetByIdAsync(Guid id) => await _dbSet.FindAsync(id);
    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) => await _dbSet.Where(predicate).ToListAsync();
    public async Task<bool> SaveChangesAsync() => await _appDbContext.SaveChangesAsync() >0;

}
    
 

        



   