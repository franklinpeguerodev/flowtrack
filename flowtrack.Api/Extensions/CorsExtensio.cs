namespace flowtrack.Api.Extensions;
public static class CorsExtension
{
    public const string PolicyName = "AllowFrontend";
    public static IServiceCollection AddFrontendCors (this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName,policy =>
            {
                policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("Content-Disposition");
            }
            );
        });
    
        return services;
    }
}