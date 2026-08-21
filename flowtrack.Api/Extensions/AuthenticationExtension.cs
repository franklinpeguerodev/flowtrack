using System.Text;
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
        });
        services.AddAuthorization();
        
        return services;
    }
}