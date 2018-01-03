using ContactUs.Core.Commands;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ContactUs.Core.CommandHandlers
{
    public class CreateContactCommandHandler : ICommandHandlerAsync<CreateContactCommand>
    {
        private readonly DbContext _dbContext;

        public CreateContactCommandHandler(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task HandleAsync(CreateContactCommand command)
        {
            _dbContext.Add(command.Contact);

            await _dbContext.SaveChangesAsync();
        }
    }
}
