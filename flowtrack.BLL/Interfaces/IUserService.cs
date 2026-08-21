using flowtrack.BLL.DTOs.User;
using flowtrack.Entities;

namespace flowtrack.BLL.Interfaces;
public interface IUserService
{
    Task<UserProfileReponseDto> UpdateNameAsync (Guid userId, UserUpdateNameDto dto);
    Task UpdatePasswordAsync (Guid userId,UserUpdatePasswordDto dto);
}