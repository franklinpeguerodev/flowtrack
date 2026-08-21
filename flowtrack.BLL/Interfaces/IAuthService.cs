using flowtrack.BLL.DTOs.auth;

namespace flowtrack.BLL.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync (UserRegisterDto dto);
    Task<AuthResponseDto> LoginAsync (UserLoginDto dto);
}
