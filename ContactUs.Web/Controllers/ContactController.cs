using ContactUs.Core.CommandHandlers;
using ContactUs.Core.Commands;
using ContactUs.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ContactUs.Web.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly ICommandHandlerAsync<CreateContactCommand> _createContactCommandHandler;

        public ContactController(ICommandHandlerAsync<CreateContactCommand> createContactCommandHandler)
        {
            _createContactCommandHandler = createContactCommandHandler;
        }

        [HttpGet("{id}", Name = "GetContact")]
        public Contact GetContact(int id)
        {
            throw new NotImplementedException(); // Added in order for location to be generated on create
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var command = new CreateContactCommand { Contact = contact };

            await _createContactCommandHandler.HandleAsync(command);

            return CreatedAtAction("GetContact", new { id = command.Contact.ContactId }, command.Contact);
        }
    }
}