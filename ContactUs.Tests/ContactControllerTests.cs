using ContactUs.Core.CommandHandlers;
using ContactUs.Core.Commands;
using ContactUs.Core.Models;
using ContactUs.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using System.Threading.Tasks;
using Xunit;

namespace ContactUs.Tests
{
    public class ContactControllerTests
    {
        private readonly ICommandHandlerAsync<CreateContactCommand> _createContactCommandHandler;
        private readonly ContactController _contactController;

        public ContactControllerTests()
        {
            _createContactCommandHandler = Substitute.For<ICommandHandlerAsync<CreateContactCommand>>();
            _contactController = new ContactController(_createContactCommandHandler);
        }

        [Fact]
        public async Task ShouldReturnBadRequestIfModelStateIsInvalid()
        {
            _contactController.ModelState.AddModelError("Title", "Title should not be empty");

            var result = await _contactController.Create(new Contact());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task ShouldReturnCreatedIfModelStateIsValid()
        {
            var result = await _contactController.Create(new Contact());

            Assert.IsType<CreatedAtActionResult>(result);
        }

        [Fact]
        public async Task ShouldCallCommandHandlerWithModelIfModelStateIsValid()
        {
            var contact = new Contact();
            var result = await _contactController.Create(contact);

            await _createContactCommandHandler.Received().HandleAsync(Arg.Is<CreateContactCommand>(arg => arg.Contact == contact));
        }

        [Fact]
        public async Task ShouldReturnLocationOfContactIfContactIsCreated()
        {
            var contact = new Contact();

            _createContactCommandHandler
                .WhenForAnyArgs(h => h.HandleAsync(null))
                .Do(h => contact.ContactId = 1);

            var result = await _contactController.Create(contact);
            var createdResult = (CreatedAtActionResult)result;

            Assert.Equal("GetContact", createdResult.ActionName);
            Assert.Collection(createdResult.RouteValues, pair => Assert.True(pair.Key == "id" && (int)pair.Value == contact.ContactId));
        }

        [Fact]
        public async Task ShouldNotCallCommandHandlerWithModelIfModelStateIsInvalid()
        {
            _contactController.ModelState.AddModelError("Title", "Title should not be empty");

            var contact = new Contact();
            var result = await _contactController.Create(contact);

            await _createContactCommandHandler.DidNotReceiveWithAnyArgs().HandleAsync(null);
        }
    }
}
