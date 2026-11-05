using flowtrack.BLL.DTOs.Category;
using flowtrack.BLL.Exceptions;
using flowtrack.BLL.Helpers;
using flowtrack.BLL.Interfaces;
using flowtrack.BLL.Mappings;
using flowtrack.DAL.interfaces;
using flowtrack.Entities;

namespace flowtrack.BLL.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IBudgetRepository _budgetRepository;

    public CategoryService(ICategoryRepository categoryRepository,IBudgetRepository budgetRepository)
    {
        _categoryRepository = categoryRepository;
        _budgetRepository= budgetRepository;
        
    }

    public async Task<CategoryResponseDto> CreateAsync(Guid userId, CategoryCreateDto dto)
    {
        if (await _categoryRepository.IsDuplicateNameAsync(userId, dto.Name) is not null)
            throw new DuplicateResourceException($"El nombre de la categoría ya existe: {dto.Name}");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            IsActive = true,
            UserId = userId
        };

        await _categoryRepository.CreateAsync(category);
        await _categoryRepository.SaveChangesAsync();

        return category.ToDto();
    }

    public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync(Guid userId)
    {
        var categories = await _categoryRepository.FindAsync(c => c.UserId == userId);
        return categories.Select(c => c.ToDto());
    }

    public async Task<CategoryResponseDto> GetByIdAsync(Guid userId, Guid categoryId)
    {
        var category = await GetOwnedCategoryOrThrow(userId, categoryId);
        return category.ToDto();
    }

    public async Task<CategoryResponseDto> UpdateAsync(Guid userId, Guid categoryId, CategoryUpdateDto dto)
    {
        var category = await GetOwnedCategoryOrThrow(userId, categoryId);

        // El nombre debe seguir siendo único entre las categorías del usuario.
        // Se excluye la propia categoría para no bloquear la edición de su nombre.
        var duplicated = await _categoryRepository.IsDuplicateNameAsync(userId, dto.Name, categoryId);
        if (duplicated is not null)
            throw new DuplicateResourceException($"El nombre de la categoría ya existe: {dto.Name}");

        category.Name = dto.Name;
        category.IsActive = dto.IsActive;

        await _categoryRepository.UpdateAsync(category);
        await _categoryRepository.SaveChangesAsync();

        return category.ToDto();
    }

    public async Task DeleteAsync(Guid userId, Guid categoryId)
    {
        var category = await GetOwnedCategoryOrThrow(userId, categoryId);

        var hasExpenses = await _categoryRepository.ExpenseExistingAsync(categoryId);
        if (hasExpenses)
            throw new ForbiddenOperationException("No se puede eliminar: la categoría tiene gastos asociados");
        var relatedBudgets= await _budgetRepository.GetCategoryAsync(categoryId, userId);
        foreach (var budget in relatedBudgets)
        {
            await _budgetRepository.DeleteAsync(budget);
        }
        await _categoryRepository.DeleteAsync(category);
        await _categoryRepository.SaveChangesAsync();
    }

    private Task<Category> GetOwnedCategoryOrThrow(Guid userId, Guid categoryId)
        => OwnershipGuard.GetOwnershipGuardAsync(
            () => _categoryRepository.GetByIdAndUserAsync(categoryId, userId),
            "Categoría no encontrada");
}