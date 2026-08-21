using System.Net;

namespace flowtrack.BLL.Exceptions;
public class ForbiddenOperationException : AppException
{
    public ForbiddenOperationException(string message)
    : base (message,HttpStatusCode.Forbidden, "FORBIDDEN_OPERATION"){}
}