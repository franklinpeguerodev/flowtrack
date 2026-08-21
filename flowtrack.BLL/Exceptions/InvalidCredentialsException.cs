using System.Net;

namespace flowtrack.BLL.Exceptions;
public class InvalidCredentialsException : AppException
{
    public InvalidCredentialsException (string message) 
    :base (message,HttpStatusCode.Unauthorized,"INVALID_CREDETIALS"){}
}