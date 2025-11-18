using System.Text.RegularExpressions;
using ProdajaLekovaBackend.Constants;

namespace ProdajaLekovaBackend.Validators;

public static class EmailValidator
{
    private static readonly Regex EmailRegex = new(
        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        RegexOptions.None,
        TimeSpan.FromMilliseconds(ApplicationConstants.Validation.RegexTimeoutMilliseconds)
    );

    public static bool IsValid(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        return EmailRegex.IsMatch(email);
    }

    public static string GetErrorMessage()
    {
        return "Email adresa nije validna.";
    }
}
