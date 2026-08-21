using flowtrack.Entities;

namespace flowtrack.DAL.interfaces;
public interface IPaymentMethodRepository : IRepository<PaymentMethod>
{
    Task<PaymentMethod?> IsDuplicatePaymentMethod(Guid paymeentMethodId,string name);
    Task<PaymentMethod?> GetByIdAndUserAsync (Guid id, Guid userId);
}