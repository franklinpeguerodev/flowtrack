using flowtrack.Entities;

namespace flowtrack.BLL.Interfaces;
public interface ITokenGenerator
{
    string GenerateToken(User user);
}