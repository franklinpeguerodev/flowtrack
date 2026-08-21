using System.Net;

namespace flowtrack.BLL.Exceptions;
public class ResourceNotFoundException : AppException
{
    public ResourceNotFoundException (string message) 
    : base (message,HttpStatusCode.NotFound,"RESOURCE_NOT_FOUND") {}
   
}