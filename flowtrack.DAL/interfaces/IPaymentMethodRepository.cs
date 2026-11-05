using flowtrack.Entities;

namespace flowtrack.DAL.interfaces;
public interface IPaymentMethodRepository : IRepository<PaymentMethod>
{
    Task<PaymentMethod?> IsDuplicatePaymentMethod(Guid userId, string name);
    Task<PaymentMethod?> GetByIdAndUserAsync (Guid id, Guid userId);
}
