namespace ProdajaLekovaBackend.Constants;

public static class ApplicationConstants
{
    public static class Validation
    {
        public const int MinPasswordLength = 8;
        public const int MinImeLength = 5;
        public const int MaxImeLength = 15;
        public const int MinPrezimeLength = 5;
        public const int MaxPrezimeLength = 20;
        public const int MinKorisnickoImeLength = 5;
        public const int MaxKorisnickoImeLength = 20;
        public const int MaxEmailLength = 35;
        public const int MaxNazivLength = 25;
        public const int MinNazivLength = 5;
        public const int MaxOpisLength = 250;
        public const int RegexTimeoutMilliseconds = 250;
    }

    public static class Payment
    {
        public const decimal RsdToRsdConversionRate = 118m;
        public const string Currency = "rsd";
    }

    public static class Roles
    {
        public const string Admin = "Admin";
        public const string User = "User";
    }

    public static class TokenSettings
    {
        public const int ExpirationDays = 1;
    }
}
