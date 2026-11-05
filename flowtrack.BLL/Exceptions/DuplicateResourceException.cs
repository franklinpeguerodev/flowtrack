using System.Net;

namespace flowtrack.BLL.Exceptions;

public class DuplicateResourceException : AppException
{
    public DuplicateResourceException(string message) :
    base(message,HttpStatusCode.Conflict,"DUPLICATE_RESOURCE") {}
}