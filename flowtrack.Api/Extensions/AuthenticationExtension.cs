using System.Security.Claims;
using System.Text;
using flowtrack.DAL.interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace flowtrack.Api.Extensions;
public static class AuthenticationExtension
{
    public static IServiceCollection AddJwtAuthentication (
        this IServiceCollection services,IConfiguration configuration)
    {
        var jwtKey = configuration["Jwt:key"]!;
        var jwtIssuer = configuration["Jwt:issuer"];
        var jwtAudience = configuration ["Jwt:Audience"];
        services.AddAuthentication (options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme= JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer= true,
                ValidateAudience=true,
                ValidateLifetime= true,
                ValidateIssuerSigningKey= true,
                ValidIssuer=jwtIssuer,
                ValidAudience=jwtAudience,
                IssuerSigningKey= new SymmetricSecurityKey (Encoding.UTF8.GetBytes(jwtKey)),
                ClockSkew=TimeSpan.Zero
            };

            // Revocación: el claim token_version debe coincidir con el valor actual del usuario.
            // El logout lo incrementa, por lo que los tokens anteriores dejan de ser válidos.
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async context =>
                {
                    var principal = context.Principal;
                    var userIdValue = principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                    var tokenVersion = principal?.FindFirst("token_version")?.Value;

                    if (!Guid.TryParse(userIdValue, out var userId))
                    {
                        context.Fail("Token inválido.");
                        return;
                    }

                    var users = context.HttpContext.RequestServices
                        .GetRequiredService<IUserRepository>();
                    var user = await users.GetByIdAsync(userId);

                    if (user is null || user.TokenVersion.ToString() != tokenVersion)
                        context.Fail("La sesión fue cerrada. Inicia sesión de nuevo.");
                }
            };
        });
        services.AddAuthorization();
        
        return services;
    }
}
