using System.Security.Claims;
using flowtrack.BLL.DTOs.User;
using flowtrack.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace flowtrack.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserProfilesController : ControllerBase
{
    private readonly IUserService _userService;

    public UserProfilesController (IUserService userService)
    {
        _userService=userService;
    }

    private Guid UserId =>Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    [HttpPut("name")]
    public  async Task<IActionResult> UpdateName (UserUpdateNameDto dto)
    {
        var result = await _userService.UpdateNameAsync(UserId,dto);
        return Ok(result);
    }
    [HttpPut("password")]
    public async Task<IActionResult> UpdatePassword(UserUpdatePasswordDto dto)
    {
        await _userService.UpdatePasswordAsync(UserId,dto);
        return NoContent();
    }

}