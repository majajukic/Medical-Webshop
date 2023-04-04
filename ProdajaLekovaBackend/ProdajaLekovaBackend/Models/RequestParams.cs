namespace ProdajaLekovaBackend.Models
{
    public class RequestParams
    {
        const int maxPageSize = 12;
        public int PageNumber { get; set; } = 1;//default page number

        private int _pageSize = 8;//default page size

        public int PageSize
        {
            get 
            { 
                return _pageSize; 
            }
            set 
            { 
                _pageSize = (value > maxPageSize) ? maxPageSize : value; 
            }
        }

    }
}
