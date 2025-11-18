namespace ProdajaLekovaBackend.DTOs;

public class ErrorResponseDto
{
    public int StatusCode { get; set; }
    public string ErrorCode { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public IDictionary<string, string[]>? Errors { get; set; }
    public string? StackTrace { get; set; }
}
