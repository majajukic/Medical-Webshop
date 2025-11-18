using System.Text.RegularExpressions;
using ProdajaLekovaBackend.Constants;

namespace ProdajaLekovaBackend.Validators;

public static class PasswordValidator
{
    private static readonly Regex PasswordRegex = new(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        RegexOptions.None,
        TimeSpan.FromMilliseconds(ApplicationConstants.Validation.RegexTimeoutMilliseconds)
    );

    public static bool IsValid(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return false;

        if (password.Length < ApplicationConstants.Validation.MinPasswordLength)
            return false;

        return PasswordRegex.IsMatch(password);
    }

    public static string GetErrorMessage()
    {
        return $"Lozinka mora da ima najmanje {ApplicationConstants.Validation.MinPasswordLength} karaktera, " +
               "jedno veliko slovo, jedno malo slovo, jedan broj i jedan specijalni karakter.";
    }
}
