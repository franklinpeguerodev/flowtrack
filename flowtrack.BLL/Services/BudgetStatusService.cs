using flowtrack.BLL.DTOs.Budget;
using flowtrack.BLL.Enums;
using flowtrack.BLL.Helpers;
using flowtrack.BLL.Interfaces;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;

namespace flowtrack.BLL.Services;

public class BudgetStatusService : IBudgetStatusService
{
    private const decimal Threshold50 = 50m;
    private const decimal Threshold80 = 80m;
    private const decimal Threshold100 = 100m;

    private readonly IBudgetRepository _budgetRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IExpenseRepository _expenseRepository;

    public BudgetStatusService(
        IBudgetRepository budgetRepository,
        ICategoryRepository categoryRepository,
        IExpenseRepository expenseRepository)
    {
        _budgetRepository = budgetRepository;
        _categoryRepository = categoryRepository;
        _expenseRepository = expenseRepository;
    }

    public async Task<BudgetStatusDto> GetStatusAsync(Guid userId, Guid budgetId)
    {
        var budget = await OwnershipGuard.GetOwnershipGuardAsync(
            () => _budgetRepository.GetByIdAndUserAsync(budgetId, userId),
            "Presupuesto no encontrado");

        return await BuildStatusAsync(budget);
    }

    public async Task<IEnumerable<BudgetStatusDto>> GetStatusByPeriodAsync(Guid userId, int month, int year)
    {
        PeriodValidator.Validate(month, year);

        var budgets = await _budgetRepository.GetBudgetsAsync(userId, month, year);

        var statuses = new List<BudgetStatusDto>();
        foreach (var budget in budgets)
            statuses.Add(await BuildStatusAsync(budget));

        return statuses;
    }

    private async Task<BudgetStatusDto> BuildStatusAsync(Budget budget)
    {
        var category = await _categoryRepository.GetByIdAndUserAsync(budget.CategoryId, budget.UserId);
        var categoryName = category?.Name ?? "Categoría eliminada";

        var expenses = await _expenseRepository.GetByCategoryAndPeriodAsync(
            budget.UserId, budget.CategoryId, budget.Month, budget.Year);

        var spent = expenses.Sum(e => e.Amount);
        var percentage = budget.Amount == 0 ? 0 : (spent / budget.Amount) * 100;

        return new BudgetStatusDto
        {
            Id = budget.Id,
            CategoryId = budget.CategoryId,
            CategoryName = categoryName,
            Month = budget.Month,
            Year = budget.Year,
            BudgetAmount = budget.Amount,
            SpentAmount = spent,
            PercentageUsed = percentage,
            AlertLevel = GetAlertLevel(percentage)
        };
    }

    private static BudgetAlertLevel GetAlertLevel(decimal percentage) => percentage switch
    {
        >= Threshold100 => BudgetAlertLevel.Exceeded,
        >= Threshold80 => BudgetAlertLevel.Warning80,
        >= Threshold50 => BudgetAlertLevel.Warning50,
        _ => BudgetAlertLevel.Normal
    };
}