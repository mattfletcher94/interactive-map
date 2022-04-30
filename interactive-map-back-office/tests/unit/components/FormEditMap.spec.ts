import { expect } from 'chai'
import { createComponent } from './helpers';
import Component from '@/components/FormEditMap.vue'
import MapClient from '@/models/MapModels/Map.client';
import ImageClient from '@/models/ImageModels/Image.client';


describe('FormEditMap.vue', () => {

    it ("Shows errors next to form fields when not filled in", async () => {
        const component = createComponent(Component, {
            map: new MapClient({
                mapId: "123",
                mapTitle: "",
                mapDescription: "",
                mapImage: new ImageClient({ imageId: "hello" }),
                mapPitchedBookingEnabled: true,
                mapPitchedBookingURL: "",
            })
        });
        await component.find('.form').trigger('submit');

        expect(component.find('.map-title-field').classes()).to.contain('is-invalid');
        expect(component.find('.map-pitched-booking-url-field').classes()).to.contain('is-invalid');

    });

    it ("Show invalid message when prop is passed through", async () => {
        const component = createComponent(Component, {
            invalidFeedback: "Invalid",
            map: new MapClient({
                mapId: "123",
                mapTitle: "",
                mapDescription: "",
                mapImage: new ImageClient({ imageId: "hello" }),
                mapPitchedBookingEnabled: true,
                mapPitchedBookingURL: "",
            })
        });

        await component.find('.form').trigger('submit');
        expect(component.find('.alert-invalid-feedback').text()).to.equal("Invalid");

    });
    
    it ("Disables form fields when busy", async () => {
        const component = createComponent(Component, {
            busy: true,
            map: new MapClient({
                mapId: "123",
                mapTitle: "",
                mapDescription: "",
                mapImage: new ImageClient({ imageId: "hello" }),
                mapPitchedBookingEnabled: true,
                mapPitchedBookingURL: "345",
            })
        });

        await component.find('.form').trigger('submit');

        const titleField = component.find('.map-title-field').element as HTMLInputElement;
        const descField = component.find('.map-description-field').element as HTMLInputElement;
        const bookingURLField = component.find('.map-pitched-booking-url-field').element as HTMLInputElement;
        const bookingEnabledField = component.find('.map-pitched-booking-enabled-field input').element as HTMLInputElement;
        const submitBtn = component.find('.submit-form-btn').element as HTMLButtonElement;
        
        expect(titleField.disabled).to.be.true;
        expect(descField.disabled).to.be.true;
        expect(bookingURLField.disabled).to.be.true;
        expect(bookingEnabledField.disabled).to.be.true;
        expect(submitBtn.disabled).to.be.true;

    });

});