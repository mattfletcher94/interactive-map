import axios from 'axios';
import nock from 'nock';
import { expect } from 'chai'
import { createComponent, createComponentShallow } from './helpers';
import Component from '@/components/FormCreateMap.vue'
import imageData from '../../apiResponses/Image'

// Set axios adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

// Run tests
describe('FormCreateMap.vue', () => {

    /**
     * Register nock
     */
	 before(() => {
        nock(`${process.env.VUE_APP_API_BASE_URL}/`)
        .get('/images/').reply(200, { data: [imageData] })
        .get('/images/').reply(200, { data: [imageData] })
        .get('/images/').reply(200, { data: [imageData] })
    });

    it ("Shows errors next to form fields when not filled in", async () => {
        const component = createComponent(Component, {}, {
            form: {
                mapTitle: "",
                mapDescription: "",
                mapImage: []
            }
        });
        await component.find('.form').trigger('submit');
		expect(component.find('.map-title-field').classes()).to.contain('is-invalid');

    });

    it ("Show invalid message when prop is passed through", async () => {
        const component = createComponent(Component, {
            invalidFeedback: "Invalid"
        }, {
			form: {
			mapTitle: "",
			mapDescription: "",
			mapImage: []
		}});
        await component.find('.form').trigger('submit');
        expect(component.find('.alert-invalid-feedback').text()).to.equal("Invalid");
    });
    
    it ("Disables form fields when busy", async () => {
        const component = createComponent(Component, {
            busy: true,
        });

        await component.find('.form').trigger('submit');

        const titleField = component.find('.map-title-field').element as HTMLInputElement;
        const descField = component.find('.map-description-field').element as HTMLInputElement;
        const submitBtn = component.find('.create-map-btn').element as HTMLButtonElement;

        expect(titleField.disabled).to.be.true;
        expect(descField.disabled).to.be.true;
        expect(submitBtn.disabled).to.be.true;

    });

});