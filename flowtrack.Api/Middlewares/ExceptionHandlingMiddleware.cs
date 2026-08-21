using System.Net;
using System.Text.Encodings.Web;
using System.Text.Json;
using flowtrack.Api.Models.Response;
using flowtrack.BLL.Exceptions;

namespace flowtrack.Api.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    public ExceptionHandlingMiddleware(RequestDelegate netx,ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next=netx;
        _logger=logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }catch (Exception e)
        {
            await HandleExceptionAsync(context, e);
        }
    }
    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = new ErrorResponse
        {
            RequestId=context.TraceIdentifier
        };
    
        if (exception is AppException appEx)
        {
            _logger.LogWarning(appEx,"Excepcion de negocio controlada: {ErrorType}", appEx.Errortype);
            
            context.Response.StatusCode= (int)appEx.StatusCode;
            response.StatusCode= (int) appEx.StatusCode;
            response.Errortype= appEx.Errortype;
            response.Message= appEx.Message;
        }else
        {
            _logger.LogError(exception,"Exception no controlada");
        
            context.Response.StatusCode=(int)HttpStatusCode.InternalServerError;
            response.StatusCode=(int)HttpStatusCode.InternalServerError;
            response.Errortype= "INTERNAL_ERROR";
            response.Message = "Ocurrio un error inesperado.Intenta mas tarde.";
        
        }
        var jsonOptions = new JsonSerializerOptions 
        {PropertyNamingPolicy=JsonNamingPolicy.CamelCase,
        Encoder =  JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };
            await context.Response.WriteAsJsonAsync(response,jsonOptions);
    
    
    }


}