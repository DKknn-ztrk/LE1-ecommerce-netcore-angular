using System;
using System.Collections;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;
        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {

            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            // We're going to give it the type of the entity that's going to check to see if there's already a hash
            if (_repositories == null) _repositories = new Hashtable();

            var type = typeof(TEntity).Name;
            
            // It's going to check to see if our repositories hash table already contains a repository with this particular type
            if (!_repositories.ContainsKey(type))
            {
                // if it doesn't, then what we're going to do is create a repository type of generic repository.
                var repositoryType = typeof(GenericRepository<>);
                // And then we're going to generate or create an instance of this repository of the product and pass in
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);

                // then we add this repository to the hash
                _repositories.Add(type, repositoryInstance);
            }

            // then we return it.
            return (IGenericRepository<TEntity>) _repositories[type];
        }
    }
}