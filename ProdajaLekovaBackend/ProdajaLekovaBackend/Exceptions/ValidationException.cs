namespace ProdajaLekovaBackend.Exceptions;

public class ValidationException : BaseException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException(string message)
        : base(message, 422, "VALIDATION_ERROR")
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("Greška pri validaciji.", 422, "VALIDATION_ERROR")
    {
        Errors = errors;
    }
}
