using flowtrack.BLL.DTOs.PaymentMethod;

namespace flowtrack.BLL.Interfaces;
public interface IPaymentMethodService
{
    Task <PaymentMethodResponseDto> CreateAsync(Guid userId,PaymentMethodCreateDto dto);
    Task <PaymentMethodResponseDto> UpdateAsync (Guid userId,Guid paymentMethodId,PaymentMethodUpdateDto dto);
    Task DeleteAsync (Guid userId,Guid paymentMethodId); 
    Task <IEnumerable<PaymentMethodResponseDto>> GetAllAsync (Guid userId);
    Task <PaymentMethodResponseDto> GetByIdAsync(Guid userId,Guid paymentMethodId);
}