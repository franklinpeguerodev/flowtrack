using flowtrack.BLL.DTOs.Category;

namespace flowtrack.BLL.Interfaces;

public interface ICategoryService
{
    Task<CategoryResponseDto> CreateAsync(Guid userId, CategoryCreateDto dto);
    Task<CategoryResponseDto> UpdateAsync(Guid userId, Guid categoryId, CategoryUpdateDto dto);
    Task DeleteAsync(Guid userId, Guid categoryId);
    Task<IEnumerable<CategoryResponseDto>> GetAllAsync(Guid userId);
    Task<CategoryResponseDto> GetByIdAsync(Guid userId, Guid categoryId);
}