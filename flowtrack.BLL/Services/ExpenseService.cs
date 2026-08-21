using flowtrack.BLL.DTOs.Expense;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Helpers;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Mappings;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;

namespace flowtrack.BLL.Services;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IPaymentMethodRepository _paymentMethodRepository;

    public ExpenseService(
        IExpenseRepository expenseRepository,
        ICategoryRepository categoryRepository,
        IPaymentMethodRepository paymentMethodRepository)
    {
        _expenseRepository = expenseRepository;
        _categoryRepository = categoryRepository;
        _paymentMethodRepository = paymentMethodRepository;
    }

    public async Task<ExpenseResponseDto> CreateAsync(Guid userId, ExpenseCreateDto dto)
    {
        await ValidateExpenseAsync(userId, dto.Amount, dto.Date, dto.CategoryId, dto.PaymentMethodId);

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            PaymentMethodId = dto.PaymentMethodId,
            UserId = userId
        };

        await _expenseRepository.CreateAsync(expense);
        await _expenseRepository.SaveChangesAsync();

        return expense.ToDto();
    }

    public async Task<ExpenseResponseDto> UpdateAsync(Guid userId, Guid expenseId, ExpenseUpdateDto dto)
    {
        var expense = await GetOwnedExpenseOrThrow(userId, expenseId);

        await ValidateExpenseAsync(userId, dto.Amount, dto.Date, dto.CategoryId, dto.PaymentMethodId);

        expense.Amount = dto.Amount;
        expense.Date = dto.Date;
        expense.Description = dto.Description;
        expense.CategoryId = dto.CategoryId;
        expense.PaymentMethodId = dto.PaymentMethodId;

        await _expenseRepository.UpdateAsync(expense);
        await _expenseRepository.SaveChangesAsync();

        return expense.ToDto();
    }

    public async Task DeleteAsync(Guid userId, Guid expenseId)
    {
        var expense = await GetOwnedExpenseOrThrow(userId, expenseId);

        await _expenseRepository.DeleteAsync(expense);
        await _expenseRepository.SaveChangesAsync();
    }

    public async Task<IEnumerable<ExpenseResponseDto>> GetAllAsync(Guid userId)
    {
    var expenses = await _expenseRepository.GetAllByUserWithDetailsAsync(userId);
    return expenses.Select(e => e.ToDto());
    }

    public async Task<ExpenseResponseDto> GetByIdAsync(Guid userId, Guid expenseId)
    {
        var expense = await GetOwnedExpenseOrThrow(userId, expenseId);
        return expense.ToDto();
    }

    private async Task ValidateExpenseAsync(Guid userId, decimal amount, DateTime date, Guid categoryId, Guid paymentMethodId)
    {
        if (amount <= 0)
            throw new BusinessRuleException("El monto debe ser positivo.");

        if (date > DateTime.UtcNow)
            throw new BusinessRuleException("La fecha no puede ser futura.");

        var category = await _categoryRepository.GetByIdAndUserAsync(categoryId, userId);
        if (category is null)
            throw new ResourceNotFoundException("La categoría no existe.");

        var paymentMethod = await _paymentMethodRepository.GetByIdAndUserAsync(paymentMethodId, userId);
        if (paymentMethod is null)
            throw new ResourceNotFoundException("El metodo de pago no existe.");
    }

    private Task<Expense> GetOwnedExpenseOrThrow(Guid userId, Guid expenseId)
        => OwnershipGuard.GetOwnershipGuardAsync(
            () => _expenseRepository.GetByIdAndUserAsync(expenseId, userId),
            "Gasto no encontrado");
}