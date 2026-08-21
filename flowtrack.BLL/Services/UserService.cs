using flowtrack.BLL.DTOs.auth;
using flowtrack.BLL.DTOs.User;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Interfaces;
using flowtrack.DAL.interfaces;

namespace flowtrack.BLL.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService (IUserRepository userRepository)
    {
        _userRepository=userRepository;
    }
    public async Task<UserProfileReponseDto> UpdateNameAsync(Guid userId, UserUpdateNameDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null) throw new ResourceNotFoundException ("Este usaurio no existe");
        
        user.Name = dto.Name;
        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();
        
        
     return new UserProfileReponseDto
     {
         Id=user.Id,
         Name=user.Name,
         Email=user.Email
     };
    }

    public async Task UpdatePasswordAsync(Guid userId, UserUpdatePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null) throw new ResourceNotFoundException ("Usuario no encontrado.");
        if (!BCrypt.Net.BCrypt.Verify(dto.NewPassword,user.PasswordHash)) throw new InvalidCredentialsException ("La contrasena actual es incorrecta.");
        user.PasswordHash= BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();
    }
}