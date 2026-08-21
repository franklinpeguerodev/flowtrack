
using flowtrack.BLL.DTOs.auth;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Interfaces;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;

namespace flowtrack.BLL.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenGenerator _tokenGenerator;

    public AuthService (IUserRepository userRepository,ITokenGenerator tokenGenerator) 
    {
        _userRepository = userRepository;
        _tokenGenerator=tokenGenerator;
    }

       public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto)
    {
        if (await _userRepository.EmailxistingAsync(dto.Email))
        throw new DuplicateResourceException("El email ya está registrado");
        var user = new User{
           Id= Guid.NewGuid(),
           Name= dto.Name,
           Email = dto.Email,
           PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };
        await _userRepository.CreateAsync(user);
        await _userRepository.SaveChangesAsync();
        return new AuthResponseDto
        {
            Token=_tokenGenerator.GenerateToken(user),
            Name = user.Name,
            Email = user.Email
        };
    }
    public async Task<AuthResponseDto> LoginAsync(UserLoginDto dto)
    {
       var user = await _userRepository.GetByEmailAsync(dto.Email);
       if(user is null || !BCrypt.Net.BCrypt.Verify(dto.Password,user.PasswordHash))
       throw new InvalidCredentialsException("Credenciales inavalidas");
       return new AuthResponseDto
       {
           Token = _tokenGenerator.GenerateToken(user),
           Name= user.Name,
           Email = user.Email
       };
    }

 
}