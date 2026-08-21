using flowtrack.BLL.DTOs.PaymentMethod;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Helpers;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Mappings;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;

namespace flowtrack.BLL.Services;

public class PaymentMethodService : IPaymentMethodService
{
    private readonly IPaymentMethodRepository _paymentMethodRepositoy;

    public PaymentMethodService (IPaymentMethodRepository paymentMethodRepository)
    {
        _paymentMethodRepositoy=paymentMethodRepository;
    }
    public async Task<PaymentMethodResponseDto> CreateAsync(Guid userId, PaymentMethodCreateDto dto)
    {
        if(await _paymentMethodRepositoy.IsDuplicatePaymentMethod(userId,dto.Name) is not null)
        throw new DuplicateResourceException($"Ya existe este metodo de pago {dto.Name}");
        var paymentMethod= new PaymentMethod
        {
         Id=Guid.NewGuid(),
         Name=dto.Name,
         IsActive=true,
         UserId =userId
        };
        await _paymentMethodRepositoy.CreateAsync(paymentMethod);
        await _paymentMethodRepositoy.SaveChangesAsync();
        return paymentMethod.ToDto();
    }
   public async Task<IEnumerable<PaymentMethodResponseDto>> GetAllAsync(Guid userId)
    {
        var paymentMethods = await _paymentMethodRepositoy.FindAsync(p=> p.UserId == userId);

        return paymentMethods.Select(p=> p.ToDto());
    }
    public async Task<PaymentMethodResponseDto> GetByIdAsync(Guid userId, Guid paymentMethodId)
    {
       var paymentMethod = await GetOwnedPaymentMethodorThrow(userId,paymentMethodId);
       return paymentMethod.ToDto();
    }
    public async Task<PaymentMethodResponseDto> UpdateAsync(Guid userId, Guid paymentMethodId, PaymentMethodUpdateDto dto)
    {
        var paymentMethod = await GetOwnedPaymentMethodorThrow(userId,paymentMethodId);
        paymentMethod.Name= dto.Name;
        paymentMethod.IsActive=dto.IsActive;
        await _paymentMethodRepositoy.UpdateAsync(paymentMethod);
        await _paymentMethodRepositoy.SaveChangesAsync();

        return paymentMethod.ToDto();
    }

    public async Task DeleteAsync(Guid userId, Guid paymentMethodId)
    {   var paymentMethod = await GetOwnedPaymentMethodorThrow(userId,paymentMethodId);
    
        await _paymentMethodRepositoy.DeleteAsync(paymentMethod);
        await _paymentMethodRepositoy.SaveChangesAsync();
       
      
    }

 

 

    private Task<PaymentMethod> GetOwnedPaymentMethodorThrow (Guid userId,Guid paymentMethodId)
    => OwnershipGuard.GetOwnershipGuardAsync(
        () => _paymentMethodRepositoy.GetByIdAndUserAsync(paymentMethodId,userId),"Metodo de pago no encontrado"
    );
}