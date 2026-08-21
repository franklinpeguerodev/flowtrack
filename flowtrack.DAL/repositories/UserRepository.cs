using System.Linq.Expressions;
using flowtrack.DAL.context;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;

namespace flowtrack.DAL.repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository (AppDbContext appDbContext):base(appDbContext){}

    public async Task<bool> EmailxistingAsync(string email)
    => await _dbSet.AnyAsync(u=> u.Email == email);

    public async Task<User?> GetByEmailAsync(string email)
    
       => await _dbSet.FirstOrDefaultAsync(u=> u.Email == email);
    
    
}