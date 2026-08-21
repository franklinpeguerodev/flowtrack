using System.Security.Claims;
using flowtrack.BLL.DTOs.Category;
using flowtrack.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace flowtrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService=categoryService;
    }
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create (CategoryCreateDto dto)
    {
        var result = await _categoryService.CreateAsync(UserId,dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _categoryService.GetAllAsync(UserId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById (Guid id)
    {
        var result = await _categoryService.GetByIdAsync(UserId,id);
        return Ok(result);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Update (Guid id, CategoryUpdateDto dto)
    {
        var result = await _categoryService.UpdateAsync(UserId,id,dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete (Guid id)
    {
         await _categoryService.DeleteAsync(UserId,id);
        return NoContent();
    }

}