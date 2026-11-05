using flowtrack.BLL.DTOs.Budget;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Helpers;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Mappings;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;

namespace flowtrack.BLL.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly ICategoryRepository _categoryRepository;

    public BudgetService (IBudgetRepository budgetRepository,ICategoryRepository categoryRepository)
    {
        _budgetRepository=budgetRepository;
        _categoryRepository=categoryRepository;
    }
    public async Task<BudgetResponseDto> CreateAsync(Guid userId, BudgetCreateDto dto)
    {
        PeriodValidator.Validate(dto.Month, dto.Year);
        if (dto.Amount <= 0)
        throw new BusinessRuleException("El monto debe ser positivo.");
        if (await _categoryRepository.GetByIdAndUserAsync(dto.CategoryId,userId) is null)
        throw new ResourceNotFoundException("La categoría no existe.");
        if( await _budgetRepository.IsDuplicateBudget(userId,dto.CategoryId,dto.Month,dto.Year) is not null)
        throw new DuplicateResourceException("Ya tienes un presupuesto con las mismas propiedades.");
        var budget = new Budget
        {
          Id=Guid.NewGuid(),
          CategoryId=dto.CategoryId,
          Amount=dto.Amount,
          Month=dto.Month,
          Year=dto.Year,
          UserId=userId
        };
        await _budgetRepository.CreateAsync(budget);
        await _budgetRepository.SaveChangesAsync();
        return budget.ToDto();
    
    }

    public async Task<IEnumerable<BudgetResponseDto>> GetAllAsync(Guid userId)
    {
        var Budgets = await _budgetRepository.FindAsync(b=> b.UserId == userId);
        return Budgets.Select(b=> b.ToDto());
    }

      public async Task<BudgetResponseDto> GetByIdAsync(Guid userId, Guid budgetId)
    {
        var budget = await GetOwnedBudgetOrThrow(userId,budgetId);
        return budget.ToDto();
    }
    public async Task<BudgetResponseDto> UpdateAsync(Guid userId, Guid budgetId, BudgetUpdateDto dto)
    {
        var budget = await GetOwnedBudgetOrThrow(userId,budgetId);
        if (dto.Amount <= 0)
        throw new BusinessRuleException("El monto debe ser positivo.");
        budget.Amount = dto.Amount;
        await _budgetRepository.UpdateAsync(budget);
        await _budgetRepository.SaveChangesAsync();
        return budget.ToDto();
    }
    public async Task DeleteAsync(Guid userId, Guid budgetId)
    {
        var budget = await GetOwnedBudgetOrThrow(userId,budgetId);

        await _budgetRepository.DeleteAsync(budget);
        await _budgetRepository.SaveChangesAsync();

    }



    private Task<Budget> GetOwnedBudgetOrThrow (Guid userId,Guid budgetId)
    => OwnershipGuard.GetOwnershipGuardAsync(
        () => _budgetRepository.GetByIdAndUserAsync(budgetId,userId),
        "Presupuesto no encontrado");
    
}