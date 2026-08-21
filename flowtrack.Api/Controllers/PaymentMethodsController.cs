using System.Security.Claims;
using flowtrack.BLL.DTOs.PaymentMethod;
using flowtrack.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace flowtrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentMethodsController : ControllerBase
{
    private IPaymentMethodService _paymentMethodService;
    public PaymentMethodsController (IPaymentMethodService paymentMethodService)
    {
        _paymentMethodService=paymentMethodService;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create (PaymentMethodCreateDto dto)
    {
        var result = await _paymentMethodService.CreateAsync(UserId,dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _paymentMethodService.GetAllAsync(UserId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _paymentMethodService.GetByIdAsync(UserId,id);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update (Guid id,PaymentMethodUpdateDto dto)
    {
        var result = await _paymentMethodService.UpdateAsync(UserId,id,dto);
        return Ok(result);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete (Guid id)
    {
        await _paymentMethodService.DeleteAsync(UserId,id);
        return NoContent();
    }



}