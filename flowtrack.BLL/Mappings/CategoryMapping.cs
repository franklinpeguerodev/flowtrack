using flowtrack.BLL.DTOs.Category;
using flowtrack.Entities;

namespace flowtrack.BLL.Mappings;
public static class CategoryMapping
{
    public static CategoryResponseDto ToDto (this Category category) => new ()
    {
        Id=category.Id,
        Name = category.Name,
        IsActive = category.IsActive,
        CreatedAt = category.CreatedAt
    };
}