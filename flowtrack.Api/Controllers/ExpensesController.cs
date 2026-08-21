using System.Security.Claims;
using flowtrack.BLL.DTOs.Expense;
using flowtrack.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace flowtrack.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private IExpenseService _expenseService;
    public ExpensesController (IExpenseService expenseService)
    {
        _expenseService=expenseService;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create (ExpenseCreateDto dto)
    {
        var expense = await _expenseService.CreateAsync(UserId,dto);
        return Ok(expense);
    }
 [HttpGet]
 public async Task<IActionResult> GetAll()
    {
        var expenses= await _expenseService.GetAllAsync(UserId);
        return Ok(expenses);
    }
 [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _expenseService.GetByIdAsync(UserId,id);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update (Guid id,ExpenseUpdateDto dto)
    {
        var result = await _expenseService.UpdateAsync(UserId,id,dto);
        return Ok(result);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete (Guid id)
    {
        await _expenseService.DeleteAsync(UserId,id);
        return NoContent();
    }













}