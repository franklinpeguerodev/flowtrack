using System.Net;

namespace flowtrack.BLL.Exceptions;
public abstract class AppException : Exception
{
    public HttpStatusCode StatusCode {get;}
    public string Errortype {get;}

    protected AppException(string message,HttpStatusCode statusCode, string errortype) : base(message)
    {
        StatusCode=statusCode;
        Errortype=errortype;
    }
}
