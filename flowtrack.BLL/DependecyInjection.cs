using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Services;
using flowtrack.BLL.Services.Export;
using Microsoft.Extensions.DependencyInjection;

namespace flowtrack.BLL;
public static class DependecyInjection {
    public static IServiceCollection AddBusinessLogicLayer(
    this IServiceCollection services)
    {
        services.AddScoped<ITokenGenerator,JwtTokenGenerator>();
        services.AddScoped<IAuthService,AuthService>();
        services.AddScoped<ICategoryService,CategoryService>();
        services.AddScoped<IPaymentMethodService,PaymentMethodService>();
        services.AddScoped<IBudgetService,BudgetService>();
        services.AddScoped<IBudgetStatusService,BudgetStatusService>();
        services.AddScoped<IExpenseService,ExpenseService>();
        services.AddScoped<IExpenseImportService,ExpenseImportService>();
        services.AddScoped<IUserService,UserService>();
        services.AddScoped<IReportExporter, JsonReportExporter>();
        services.AddScoped<IReportExporter, TxtReportExporter>();
        services.AddScoped<IReportExporter, ExcelReportExporter>();
        services.AddScoped<IReportExportService, ReportExportService>();
        return services;
    }
}