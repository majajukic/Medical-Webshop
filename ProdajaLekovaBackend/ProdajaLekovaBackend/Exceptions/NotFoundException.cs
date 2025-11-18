using ProdajaLekovaBackend.Constants;

namespace ProdajaLekovaBackend.Exceptions;

public class NotFoundException : BaseException
{
    public NotFoundException(string resourceName, object key)
        : base($"{resourceName} sa ID-jem '{key}' nije pronađen.", ApplicationConstants.HttpStatusCodes.NotFound, ApplicationConstants.ErrorCodes.NotFound)
    {
    }

    public NotFoundException(string message)
        : base(message, ApplicationConstants.HttpStatusCodes.NotFound, ApplicationConstants.ErrorCodes.NotFound)
    {
    }
}
