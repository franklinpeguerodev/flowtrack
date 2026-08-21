using flowtrack.DAL.context;
using flowtrack.DAL.interfaces;
using flowtrack.DAL.repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace flowtrack.DAL;
public static class DependencyInjection
{
    public static IServiceCollection AddDataAccessLayer (
        this IServiceCollection services,IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default");
        services.AddDbContext<AppDbContext> (options =>
        options.UseMySql(connectionString,ServerVersion.AutoDetect(connectionString)));
        services.AddScoped<IUserRepository,UserRepository>();
        services.AddScoped<ICategoryRepository,CategoryRepository>();
        services.AddScoped<IBudgetRepository,BudgetRepository>();
        services.AddScoped<IPaymentMethodRepository,PaymentMethodRepository>();
        services.AddScoped<IExpenseRepository,ExpenseRepository>();
    return services;
    }
}