using System.Net;

namespace flowtrack.BLL.Exceptions;
public class BusinessRuleException : AppException
{
    public BusinessRuleException (string message)
    :base (message,HttpStatusCode.BadRequest, "BUSINESS_RULE_VIOLATION"){}
}