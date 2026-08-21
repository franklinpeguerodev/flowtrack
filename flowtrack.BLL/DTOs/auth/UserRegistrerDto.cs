namespace flowtrack.BLL.DTOs.auth;
public record UserRegisterDto
{
    public string Name {get;init;} =string.Empty;
    public string Email {get;init;} = string.Empty;
    public string Password {get;init;} =string.Empty;
}