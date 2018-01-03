using System;

namespace ContactUs.Core.Models
{
    public class Contact
    {
        public int ContactId { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
