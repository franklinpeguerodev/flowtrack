namespace flowtrack.BLL.DTOs.User;
public record UserUpdatePasswordDto
{
    public string CurrentPassword {get;init;} = string.Empty;
    public string NewPassword {get;init;} = string.Empty;
}