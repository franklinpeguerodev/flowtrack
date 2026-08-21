namespace flowtrack.BLL.DTOs.auth;
public record AuthResponseDto{
    public string Token {get;init;} =string.Empty;
    public string Name {get;init;} =string.Empty;
    public string Email {get;init;} =string.Empty;
}