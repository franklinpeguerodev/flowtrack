namespace flowtrack.Entities;

public class User
{
    public Guid Id{get;set;}
    public string Name {get;set;} =string.Empty;
    public string Email {get;set;}= string.Empty;
    public string PasswordHash {get;set;} = string.Empty;      
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;   

    //propiedades de navegacion  
    public ICollection<Category>  Categories {get;} = [];
    public ICollection<Budget> Budgets {get;} = [];
    public ICollection<PaymentMethod> PaymentMethods {get;}=[];
    public ICollection<Expense> Expenses {get;} =[];                          
}

