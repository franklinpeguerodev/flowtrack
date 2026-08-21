namespace flowtrack.BLL.DTOs.auth;
public record UserLoginDto
{
    public string Email {get;init;} = string.Empty;
    public string Password{get;init;} = string.Empty;
}