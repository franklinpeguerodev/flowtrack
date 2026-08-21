using System.Dynamic;

namespace flowtrack.BLL.DTOs.User;
 public record UserProfileReponseDto
{
    public Guid Id {get;init;}
    public string Name = string.Empty;
    public String Email=string.Empty;
}