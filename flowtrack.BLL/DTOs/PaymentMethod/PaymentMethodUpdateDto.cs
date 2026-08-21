namespace flowtrack.BLL.DTOs.PaymentMethod;
public record PaymentMethodUpdateDto{
    public string Name {get;init;} =string.Empty;
    public bool IsActive {get;init;}
}