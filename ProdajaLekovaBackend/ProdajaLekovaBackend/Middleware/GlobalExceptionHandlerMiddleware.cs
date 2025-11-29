using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace ProdajaLekovaBackend.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

            var statusCode = HttpStatusCode.InternalServerError;
            var problemDetails = new ProblemDetails
            {
                Status = (int)statusCode,
                Title = "Internal server error",
                Detail = "Internal server error. Please try again later.",
                Instance = context.Request.Path
            };

            // Handle specific exception types
            switch (exception)
            {
                case KeyNotFoundException:
                    statusCode = HttpStatusCode.NotFound;
                    problemDetails.Status = (int)statusCode;
                    problemDetails.Title = "Resource not found";
                    problemDetails.Detail = exception.Message;
                    break;

                case ArgumentException:
                    statusCode = HttpStatusCode.BadRequest;
                    problemDetails.Status = (int)statusCode;
                    problemDetails.Title = "Bad request";
                    problemDetails.Detail = exception.Message;
                    break;

                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Forbidden;
                    problemDetails.Status = (int)statusCode;
                    problemDetails.Title = "Access forbidden";
                    problemDetails.Detail = "You do not have a permission to execute this action.";
                    break;

                case InvalidOperationException:
                    statusCode = HttpStatusCode.Conflict;
                    problemDetails.Status = (int)statusCode;
                    problemDetails.Title = "Conflict";
                    problemDetails.Detail = exception.Message;
                    break;

                default:
                    // For unhandled exceptions, don't expose internal details
                    _logger.LogError(exception, "Unhandled exception of type {ExceptionType}", exception.GetType().Name);
                    break;
            }

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = (int)statusCode;

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(problemDetails, options);
            await context.Response.WriteAsync(json);
        }
    }
}
