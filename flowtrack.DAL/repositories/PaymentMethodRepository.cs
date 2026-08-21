using flowtrack.DAL.context;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;

namespace flowtrack.DAL.repositories;
public class PaymentMethodRepository : Repository<PaymentMethod>,IPaymentMethodRepository
{
    public PaymentMethodRepository(AppDbContext appDbContext) : base(appDbContext){}

    public async Task<PaymentMethod?> IsDuplicatePaymentMethod( Guid userId, string name) 
    => await _dbSet.FirstOrDefaultAsync(p=> p.UserId==userId && p.Name==name);
      public async Task<PaymentMethod?> GetByIdAndUserAsync(Guid id, Guid userId)
    => await _dbSet.FirstOrDefaultAsync(p=> p.Id == id && p.UserId ==userId);
}