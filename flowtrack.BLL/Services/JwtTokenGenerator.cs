using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using flowtrack.BLL.Interfaces;
using flowtrack.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace flowtrack.BLL.Services;

public class JwtTokenGenerator : ITokenGenerator
{
    private readonly IConfiguration _configuration;
    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration=configuration;
    }
    public string GenerateToken(User user)
    {
         var claims = new[]
        {
            new Claim (ClaimTypes.NameIdentifier,user.Id.ToString()),
            new Claim (ClaimTypes.Email,user.Email),
            new Claim(ClaimTypes.Name,user.Name)
        };
    
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:key"]!)
        );
    
        var credentials = new SigningCredentials (key,SecurityAlgorithms.HmacSha256);
        var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"]!);
        var token = new JwtSecurityToken (
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims:claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    
    }
}
