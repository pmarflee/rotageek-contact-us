import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class ContactUsComponent extends Vue {
    title: string = '';
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    message: string = '';
    showSuccessMessage: boolean = false;
    showFailureMessage: boolean = false;

    readonly titles: string[] = [ 'Mr', 'Mrs', 'Miss', 'Ms', 'Master' ];

    validateAndSubmit() {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.showFailureMessage = false;
                this.submit();
                return;
            }

            alert('Please correct errors before submitting');
        });
    }

    private submit() {
        let headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch('api/Contact/Create', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title: this.title,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                message: this.message
            })
        })
        .then(response => {
            if (response.status === 201) {
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 5000);
            } else {
                this.showFailureMessage = true;
            }
        });
    }
}
