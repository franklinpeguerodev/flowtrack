namespace flowtrack.Entities;

public class PaymentMethod
{
    public Guid Id {get;set;}
  
    public string Name {get;set;} =string.Empty;
    public bool IsActive {get;set;} = true;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;

    //Propiedades de navegacion
    public Guid UserId {get;set;}
    public User? User {get;set;}
}
