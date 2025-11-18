namespace ProdajaLekovaBackend.Exceptions;

public class NotFoundException : BaseException
{
    public NotFoundException(string resourceName, object key)
        : base($"{resourceName} sa ID-jem '{key}' nije pronađen.", 404, "NOT_FOUND")
    {
    }

    public NotFoundException(string message)
        : base(message, 404, "NOT_FOUND")
    {
    }
}
