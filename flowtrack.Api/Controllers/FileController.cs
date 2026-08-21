using System.Security.Claims;
using flowtrack.BLL.DTOs.File;
using flowtrack.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace flowtrack.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FileController : ControllerBase
{
    private readonly IExpenseImportService _expenseImportService;
    private readonly IReportExportService _reportExportService; 
    public FileController (IExpenseImportService expenseImportService,IReportExportService reportExportService)
    {
        _expenseImportService=expenseImportService;
        _reportExportService = reportExportService;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("import/expenses")]
    public async Task<IActionResult> ImportExpenses (IFormFile file)
    {
        var result = await _expenseImportService.ImportAsync(UserId,file);
        return Ok(result);
    }

    [HttpPost("export/report")]
    public async Task<IActionResult> ExportReport([FromBody] ReportExportRequestDto request)
    {
        var file = await _reportExportService.ExportAsync(UserId, request);
        return File(file.Content, file.ContentType, file.FileName);
    }


}