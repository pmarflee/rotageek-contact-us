using Xunit;
using FluentValidation.TestHelper;
using ContactUs.Core.Models.Validation;

namespace ContactUs.Tests
{
    public class ContactValidatorTests
    {
        private readonly ContactValidator _validator;

        public ContactValidatorTests()
        {
            _validator = new ContactValidator();
        }

        [Fact]
        public void ShouldHaveErrorWhenTitleIsNull()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.Title, (string)null);
        }

        [Fact]
        public void ShouldHaveErrorWhenTitleIsEmpty()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.Title, string.Empty);
        }

        [Fact]
        public void ShouldNotHaveErrorWhenTitleIsNotEmpty()
        {
            _validator.ShouldNotHaveValidationErrorFor(m => m.Title, "Mr");
        }

        [Fact]
        public void ShouldHaveErrorWhenFirstNameIsNull()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.FirstName, (string)null);
        }

        [Fact]
        public void ShouldHaveErrorWhenFirstNameIsEmpty()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.FirstName, string.Empty);
        }

        [Fact]
        public void ShouldNotHaveErrorWhenFirstNameIsNotEmpty()
        {
            _validator.ShouldNotHaveValidationErrorFor(m => m.FirstName, "Paul");
        }

        [Fact]
        public void ShouldHaveErrorWhenLastNameIsNull()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.LastName, (string)null);
        }

        [Fact]
        public void ShouldHaveErrorWhenLastNameIsEmpty()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.LastName, string.Empty);
        }

        [Fact]
        public void ShouldNotHaveErrorWhenLastNameIsNotEmpty()
        {
            _validator.ShouldNotHaveValidationErrorFor(m => m.LastName, "Marfleet");
        }

        [Fact]
        public void ShouldHaveErrorWhenEmailIsNull()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.Email, (string)null);
        }

        [Fact]
        public void ShouldHaveErrorWhenEmailIsEmpty()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.Email, string.Empty);
        }

        [Fact]
        public void ShouldHaveErrorWhenEmailIsInAnInvalidFormat()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.Email, "paultest.com");
        }

        [Fact]
        public void ShouldNotHaveErrorWhenEmailIsInAValidFormat()
        {
            _validator.ShouldNotHaveValidationErrorFor(m => m.Email, "paul@test.com");
        }

        [Fact]
        public void ShouldHaveErrorWhenMessageIsNull()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.Message, (string)null);
        }

        [Fact]
        public void ShouldHaveErrorWhenMessageIsEmpty()
        {
            _validator.ShouldHaveValidationErrorFor(m => m.Message, string.Empty);
        }

        [Fact]
        public void ShouldNotHaveErrorWhenMessageIsNotEmpty()
        {
            _validator.ShouldNotHaveValidationErrorFor(m => m.Message, "All your base are belong to us");
        }
    }
}
