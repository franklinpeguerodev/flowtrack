using flowtrack.BLL.Exceptions;

namespace flowtrack.BLL.Helpers;
public static class OwnershipGuard
{
    public static async Task<T> GetOwnershipGuardAsync <T>(
        Func<Task<T?>> lookup,
        string notFoundMessage ) where T :class
    {
        var entity = await lookup();
        if (entity is null)

            throw new ResourceNotFoundException(notFoundMessage);
        return entity;
    }
}