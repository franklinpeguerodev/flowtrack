using System.Net;
using System.Text.Encodings.Web;
using System.Text.Json;
using flowtrack.Api.Models.Response;
using flowtrack.BLL.Exceptions;
using flowtrack.DAL.Extensions;
using Microsoft.EntityFrameworkCore;

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
        }catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            // Petición cancelada por el cliente: no es un error del servidor.
            _logger.LogInformation("Petición cancelada por el cliente.");
            context.Response.StatusCode = 499;
        }
        catch (Exception e)
        {
            await HandleExceptionAsync(context, e);
        }
    }
    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Si la respuesta ya empezó a escribirse, no se puede enviar un cuerpo de error:
        // se aborta la conexión para no corromper la respuesta.
        if (context.Response.HasStarted)
        {
            _logger.LogWarning(exception,"Excepción ocurrida después de iniciar la respuesta.");
            context.Abort();
            return;
        }

        context.Response.ContentType = "application/json";
        var response = new ErrorResponse
        {
            RequestId=context.TraceIdentifier
        };
    
        if (exception is AppException appEx)
        {
            _logger.LogWarning(appEx,"Excepcion de negocio controlada: {ErrorType}", appEx.ErrorType);
            
            context.Response.StatusCode= (int)appEx.StatusCode;
            response.StatusCode= (int) appEx.StatusCode;
            response.ErrorType= appEx.ErrorType;
            response.Message= appEx.Message;
        }else if (exception is DbUpdateException dbUpdate && dbUpdate.IsDuplicateKey())
        {
            // La BD es la fuente de verdad para los índices UNIQUE. Si dos peticiones
            // pasan la comprobación previa a la vez, la segunda choca aquí: es un
            // conflicto de negocio (409), no un error interno (500).
            _logger.LogWarning(dbUpdate,"Registro duplicado detectado por la base de datos.");

            context.Response.StatusCode=(int)HttpStatusCode.Conflict;
            response.StatusCode=(int)HttpStatusCode.Conflict;
            response.ErrorType= "DUPLICATE_RESOURCE";
            response.Message = "Ya existe un registro con esos datos.";
        }else
        {
            _logger.LogError(exception,"Exception no controlada");
        
            context.Response.StatusCode=(int)HttpStatusCode.InternalServerError;
            response.StatusCode=(int)HttpStatusCode.InternalServerError;
            response.ErrorType= "INTERNAL_ERROR";
            response.Message = "Ocurrió un error inesperado. Intenta más tarde.";
        
        }
        var jsonOptions = new JsonSerializerOptions 
        {PropertyNamingPolicy=JsonNamingPolicy.CamelCase,
        Encoder =  JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };
            await context.Response.WriteAsJsonAsync(response,jsonOptions);
    
    
    }


}