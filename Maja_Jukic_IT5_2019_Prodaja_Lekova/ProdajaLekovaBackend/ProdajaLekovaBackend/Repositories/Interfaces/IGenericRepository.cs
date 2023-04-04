using Microsoft.EntityFrameworkCore.Query;
using ProdajaLekovaBackend.Models;
using System.Linq.Expressions;
using X.PagedList;

namespace ProdajaLekovaBackend.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IList<T>> GetAllAsync(
            Expression<Func<T, bool>> expression = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null
         );

        Task<IPagedList<T>> GetAllPagedListAsync(
            RequestParams requestParams,
            Expression<Func<T, bool>> expression = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null
            );

        Task<T> GetAsync(
            Expression<Func<T, bool>> expression, 
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null);

        Task CreateAsync(T entity);

        void UpdateAsync(T entity);

        Task DeleteAsync(int id);
    }
}
