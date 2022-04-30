import { expect } from 'chai'
import { createComponent } from './helpers';
import Component from '@/components/FormLogin.vue'

describe('FormLogin.vue', () => {

    const data =  {
        form: {
            userEmail: "test@test.com",
            userPassword: "test123456"
        }
    } 

    it ("Shows errors next to form fields when not filled in", async () => {
        const component = createComponent(Component, {}, {
            form: {
                userEmail: "",
                userPassword: "",
            }
        });

        await component.find('.form').trigger('submit');

        const emailField = component.find('.email-field');
        const passwordField = component.find('.password-field');

        expect(emailField.classes()).to.contain('is-invalid');
        expect(passwordField.classes()).to.contain('is-invalid');

    });

    it ("Show invalid message when prop is passed through", async () => {
        const component = createComponent(Component, {
            invalidFeedback: "Invalid"
        });

        await component.find('.form').trigger('submit');

        const invalidFeedback = component.find('.alert-invalid-feedback');

        expect(invalidFeedback.text()).to.equal("Invalid");

    });
    
    it ("Disables form fields when busy", async () => {
        const component = createComponent(Component, {
            busy: true,
        });

        await component.find('.form').trigger('submit');

        const emailField = component.find('.email-field').element as HTMLInputElement;
        const passwordField = component.find('.password-field').element as HTMLInputElement;
        const signInBtn = component.find('.sign-in-btn').element as HTMLButtonElement;

        expect(emailField.disabled).to.be.true;
        expect(passwordField.disabled).to.be.true;
        expect(signInBtn.disabled).to.be.true;

    });

});