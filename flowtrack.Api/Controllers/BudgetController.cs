using System.Security.Claims;
using flowtrack.BLL.DTOs.Budget;
using flowtrack.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace flowtrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetsController : ControllerBase
{
    private readonly IBudgetService _budgetService;
    private readonly IBudgetStatusService _budgetStatusService;

    public BudgetsController(IBudgetService budgetService, IBudgetStatusService budgetStatusService)
    {
        _budgetService = budgetService;
        _budgetStatusService = budgetStatusService;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create(BudgetCreateDto dto)
    {
        var result = await _budgetService.CreateAsync(UserId, dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _budgetService.GetAllAsync(UserId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _budgetService.GetByIdAsync(UserId, id);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, BudgetUpdateDto dto)
    {
        var result = await _budgetService.UpdateAsync(UserId, id, dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _budgetService.DeleteAsync(UserId, id);
        return NoContent();
    }

  
    [HttpGet("{id}/status")]
    public async Task<IActionResult> GetStatus(Guid id)
    {
        var result = await _budgetStatusService.GetStatusAsync(UserId, id);
        return Ok(result);
    }

    // --- CU08: estado de TODOS los presupuestos de un mes/año ---
    [HttpGet("status")]
    public async Task<IActionResult> GetStatusByPeriod([FromQuery] int month, [FromQuery] int year)
    {
        var result = await _budgetStatusService.GetStatusByPeriodAsync(UserId, month, year);
        return Ok(result);
    }
}