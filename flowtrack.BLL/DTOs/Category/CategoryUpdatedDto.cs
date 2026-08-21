namespace flowtrack.BLL.DTOs.Category;
public record CategoryUpdateDto
{
    public string Name {get;init;} = string.Empty;
    public bool IsActive {get;init;}
}