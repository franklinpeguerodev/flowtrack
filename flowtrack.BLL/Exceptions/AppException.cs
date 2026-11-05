using System.Net;

namespace flowtrack.BLL.Exceptions;
public abstract class AppException : Exception
{
    public HttpStatusCode StatusCode {get;}
    public string ErrorType {get;}

    protected AppException(string message,HttpStatusCode statusCode, string errorType) : base(message)
    {
        StatusCode=statusCode;
        ErrorType=errorType;
    }
}
