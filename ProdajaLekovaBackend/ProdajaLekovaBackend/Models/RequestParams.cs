using Newtonsoft.Json;

namespace ProdajaLekovaBackend.Models
{
    public class RequestParams
    {
        const int maxPageSize = 12;
        public int PageNumber { get; set; } = 1;//default page number

        private int _pageSize = 9;//default page size

        [JsonRequired]
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
