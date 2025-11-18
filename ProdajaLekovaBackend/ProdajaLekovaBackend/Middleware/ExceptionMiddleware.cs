using System.Net;
using System.Text.Json;
using ProdajaLekovaBackend.DTOs;
using ProdajaLekovaBackend.Exceptions;

namespace ProdajaLekovaBackend.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Neočekivana greška: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var errorResponse = new ErrorResponseDto();

        switch (exception)
        {
            case BaseException baseException:
                context.Response.StatusCode = baseException.StatusCode;
                errorResponse.StatusCode = baseException.StatusCode;
                errorResponse.ErrorCode = baseException.ErrorCode;
                errorResponse.Message = baseException.Message;

                if (baseException is ValidationException validationException)
                {
                    errorResponse.Errors = validationException.Errors;
                }
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.ErrorCode = "INTERNAL_SERVER_ERROR";
                errorResponse.Message = "Serverska greška. Molimo pokušajte ponovo kasnije.";
                break;
        }

        if (_env.IsDevelopment())
        {
            errorResponse.StackTrace = exception.StackTrace;
        }

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(errorResponse, options);
        return context.Response.WriteAsync(json);
    }
}
