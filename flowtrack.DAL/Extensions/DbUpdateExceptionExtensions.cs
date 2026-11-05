using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace flowtrack.DAL.Extensions;

public static class DbUpdateExceptionExtensions
{
    /// <summary>
    /// Indica si el fallo de guardado fue provocado por una clave duplicada
    /// (MySQL error 1062), por ejemplo el índice UNIQUE de Users.Email.
    /// </summary>
    public static bool IsDuplicateKey(this DbUpdateException exception)
    {
        for (Exception? inner = exception.InnerException; inner is not null; inner = inner.InnerException)
        {
            if (inner is MySqlException { Number: 1062 })
                return true;
        }

        return false;
    }
}
