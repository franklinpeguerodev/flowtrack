using System.Data.Common;
using flowtrack.BLL.DTOs.PaymentMethod;
using flowtrack.Entities;

namespace flowtrack.BLL.Mappings;
public static class PaymentMethodMapping
{
    public static PaymentMethodResponseDto ToDto(this PaymentMethod paymentMethod) => new ()
    {
        Id =  paymentMethod.Id,
        Name = paymentMethod.Name,
        IsActive = paymentMethod.IsActive,
        CreatedAt =paymentMethod.CreatedAt
    };
}