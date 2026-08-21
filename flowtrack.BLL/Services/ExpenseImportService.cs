using ClosedXML.Excel;
using flowtrack.BLL.DTOs.File;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Interfaces;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;
using Microsoft.AspNetCore.Http;

namespace flowtrack.BLL.Services;

public class ExpenseImportService : IExpenseImportService
{
    private  readonly ICategoryRepository _categoryRepository;
    private readonly IExpenseRepository _expenseRepository;
    private readonly IPaymentMethodRepository _paymentMethodRepository;
    public ExpenseImportService(ICategoryRepository categoryRepository,IExpenseRepository expenseRepository , IPaymentMethodRepository paymentMethodRepository)
    {
        _categoryRepository =categoryRepository;
        _expenseRepository=expenseRepository;
        _paymentMethodRepository=paymentMethodRepository;
    }
    public async Task<ExpenseImportResultDto> ImportAsync(Guid userId, IFormFile file)
    {
        using var stream= file.OpenReadStream();
        using var workBook = new XLWorkbook(stream);
        var worksheet = workBook.Worksheet(1);
        var rows = worksheet.RangeUsed().RowsUsed().Skip(1);

        var rowsResult = new List<ExpenseImportRowResultDto>();
        var expenseToSave = new List<Expense>();

        foreach (var row  in rows )
        {
            int rowNumber= row.RowNumber();
            try
            {
                decimal amount = row.Cell(1).GetValue<decimal>();
                DateTime date = row.Cell(2).GetValue<DateTime>();
                string description = row.Cell(3).GetValue<string>();
                string categoryName = row.Cell(4).GetValue<string>();
                string paymentMethodName = row.Cell(5).GetValue<string>();

                var category = await _categoryRepository.IsDuplicateNameAsync(userId,categoryName);
                if (category is null) throw new ResourceNotFoundException($"Esta categoria no existe, {categoryName}");
                
                var paymentMethod = await _paymentMethodRepository.IsDuplicatePaymentMethod(userId,paymentMethodName);
                if (paymentMethod is null)  throw new ResourceNotFoundException($"Esta Este metodo de pago no existe, {paymentMethodName}");
                
  
                var expense = new Expense
                {
                    Id= Guid.NewGuid(),
                    Amount=amount,
                    Date = date,
                    UserId=userId,
                    Description =description,
                    CategoryId = category.Id,
                    PaymentMethodId = paymentMethod.Id
                };
                expenseToSave.Add(expense);
                rowsResult.Add (new ExpenseImportRowResultDto
                {
                    RowNumber = rowNumber,
                    Success=true
                });
               
            }
            catch (Exception ex)
            {
                rowsResult.Add ( new ExpenseImportRowResultDto
                {
                    RowNumber= rowNumber,
                    Success=false,
                    ErrorMessage=ex.Message
                });
            }
            
        }
        foreach (var expense in expenseToSave)
        {
            await _expenseRepository.CreateAsync(expense);
        }

        await _expenseRepository.SaveChangesAsync();

        return new ExpenseImportResultDto
        {
            TotalRows = rowsResult.Count,
            SuccessCount = rowsResult.Count(r=> r.Success),
            RowResults = rowsResult,
            ErrorCount= rowsResult.Count(r=> !r.Success)
        };

    }
}