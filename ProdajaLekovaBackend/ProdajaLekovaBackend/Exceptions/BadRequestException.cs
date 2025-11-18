using ProdajaLekovaBackend.Constants;

namespace ProdajaLekovaBackend.Exceptions;

public class BadRequestException : BaseException
{
    public BadRequestException(string message)
        : base(message, ApplicationConstants.HttpStatusCodes.BadRequest, ApplicationConstants.ErrorCodes.BadRequest)
    {
    }
}
