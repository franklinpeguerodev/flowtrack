using flowtrack.Api.Middlewares;
using Microsoft.AspNetCore.Diagnostics;

namespace flowtrack.Api.Extensions;
public static class ExceptionHandlingExtension
{
    public static IApplicationBuilder UseGlobalExceptionHandling (this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}