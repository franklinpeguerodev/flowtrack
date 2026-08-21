using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;

namespace flowtrack.DAL.context;
public class AppDbContext :DbContext
{
    public AppDbContext (DbContextOptions<AppDbContext> options) : base (options)
    {}

    public DbSet<User> Users {get;set;}
    public DbSet<Category> Categories {get;set;}
    public DbSet<Budget> Budgets {get;set;}
    public DbSet<PaymentMethod> PaymentMethods {get;set;}
    public DbSet<Expense> Expenses {get;set;}

    protected override void OnModelCreating (ModelBuilder modelBuilder)
    {
        //No permitir borrado en cascada de toda la Base de datos
        base.OnModelCreating(modelBuilder);
        foreach(var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e=> e.GetForeignKeys()))
        {
            relationship.DeleteBehavior=DeleteBehavior.Restrict;
        }

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    
    }
}