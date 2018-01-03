using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ContactUs.Core.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Models.Contact>()
                .Property(m => m.Title)
                .IsRequired();
            
            builder.Entity<Models.Contact>()
                .Property(m => m.FirstName)
                .IsRequired();

            builder.Entity<Models.Contact>()
                .Property(m => m.LastName)
                .IsRequired();

            builder.Entity<Models.Contact>()
                .Property(m => m.Email)
                .IsRequired();

            builder.Entity<Models.Contact>()
                .Property(m => m.Message)
                .IsRequired();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            ChangeTracker.DetectChanges();

            var now = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added))
            {
                if (entry.Entity is Models.Contact contactEntity)
                {
                    contactEntity.CreateDate = now;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        public DbSet<Models.Contact> Contacts { get; set; }
    }
}
