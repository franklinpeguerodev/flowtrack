using flowtrack.BLL.DTOs.File;
using Microsoft.AspNetCore.Http;
namespace flowtrack.BLL.Interfaces;

public interface IExpenseImportService
{
    Task<ExpenseImportResultDto> ImportAsync(Guid userId, IFormFile file);
}