namespace flowtrack.Api.Models.Response;

public class ErrorResponse
{
    public int StatusCode {get;set;}
    public string Errortype {get;set;} =string.Empty;
    public string Message {get;set;} =string.Empty;
    public Dictionary<string, string[]>? Errors {get;set;}
    public string RequestId {get;set;}=string.Empty;
}