namespace flowtrack.Entities;

public class Expense
{
    public Guid Id {get;set;}
    public Decimal Amount {get;set;}
    public DateTime Date {get;set;}
    public string? Description {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow; 

    //propiedades de naveacion
    public Guid UserId{get;set;}
    public User? User {get;set;}
    public Guid CategoryId {get;set;}
    public Category? Category {get;set;}
    public Guid PaymentMethodId {get;set;}
    public PaymentMethod? PaymentMethod {get;set;}

}
