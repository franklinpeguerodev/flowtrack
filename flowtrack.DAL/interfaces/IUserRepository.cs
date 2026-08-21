using flowtrack.Entities;

namespace flowtrack.DAL.interfaces;

public interface IUserRepository :IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailxistingAsync(string email);
}