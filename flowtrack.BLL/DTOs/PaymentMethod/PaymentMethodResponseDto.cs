namespace flowtrack.BLL.DTOs.PaymentMethod;
public record PaymentMethodResponseDto
{
    public Guid Id {get;init;}
    public string Name {get;init;} =string.Empty;
    public bool IsActive {get;init;}
    public DateTime CreatedAt {get;init;} 
};
