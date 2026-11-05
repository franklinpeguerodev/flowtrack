
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
        // Se normaliza el email para que " X@Y.com " y "x@y.com" sean el mismo registro.
        var email = dto.Email.Trim().ToLowerInvariant();
        var name = dto.Name.Trim();

        if (await _userRepository.EmailxistingAsync(email))
        throw new DuplicateResourceException("El email ya está registrado");
        var user = new User{
           Id= Guid.NewGuid(),
           Name= name,
           Email = email,
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
       var email = dto.Email.Trim().ToLowerInvariant();
       var user = await _userRepository.GetByEmailAsync(email);
       if(user is null || !BCrypt.Net.BCrypt.Verify(dto.Password,user.PasswordHash))
       throw new InvalidCredentialsException("Credenciales inválidas");
       return new AuthResponseDto
       {
           Token = _tokenGenerator.GenerateToken(user),
           Name= user.Name,
           Email = user.Email
       };
    }

    public async Task LogoutAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
            throw new ResourceNotFoundException("Usuario no encontrado.");

        // Incrementar la versión invalida todos los JWT emitidos con la versión anterior
        // (equivale a cerrar sesión en todos los dispositivos).
        user.TokenVersion++;
        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();
    }

 
}