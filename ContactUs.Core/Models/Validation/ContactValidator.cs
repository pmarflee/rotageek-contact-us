using FluentValidation;

namespace ContactUs.Core.Models.Validation
{
    public class ContactValidator : AbstractValidator<Contact>
    {
        public ContactValidator()
        {
            RuleFor(m => m.Title).NotEmpty();
            RuleFor(m => m.FirstName).NotEmpty();
            RuleFor(m => m.LastName).NotEmpty();
            RuleFor(m => m.Email).Cascade(CascadeMode.StopOnFirstFailure).NotEmpty().EmailAddress();
            RuleFor(m => m.Message).NotEmpty();
        }
    }
}
