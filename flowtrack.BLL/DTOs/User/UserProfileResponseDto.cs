namespace flowtrack.BLL.DTOs.User;

public record UserProfileResponseDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
}
