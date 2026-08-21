namespace flowtrack.Entities;

public class Budget
{
    public Guid Id {get;set;}
    public decimal Amount {get;set;}
    public int Month {get;set;}
    public int Year {get;set;}
    public DateTime CreatedAt {get;set;} =DateTime.UtcNow;

    //Propiedades de navegacioon
    public Guid UserId {get;set;}
    public User? User{get;set;}
    public Guid CategoryId {get;set;}
    public Category? Category {get;set;}

} 
