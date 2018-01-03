using System.Threading.Tasks;

namespace ContactUs.Core.CommandHandlers
{
    public interface ICommandHandlerAsync<in TCommand>
    {
        /// <summary>
        ///     Handles the specified command asynchronously.
        /// </summary>
        /// <param name="command">The command to handle.</param>
        Task HandleAsync(TCommand command);
    }
}
