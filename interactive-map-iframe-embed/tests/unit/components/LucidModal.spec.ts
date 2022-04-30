import { expect } from 'chai'
import { createComponent, cloneObject } from './Helpers';
import Component from '@/components/LucidModal.vue'

describe('LucidModal.vue', () => {

    const props = { 
        open: true, 
        dissmissible: true,
        width: 720,
    }

    it('Renders if open prop is true', async () => {
        const component = createComponent(Component, props);
        expect(component.find('.lucid-modal').exists()).to.be.true;
        expect(component.find('.lucid-modal-inner').exists()).to.be.true;
    });

    it('Does not render if open prop is false', () => {
        const p = cloneObject(props, { open: false });
        const component = createComponent(Component, p);
        expect(component.find('.lucid-modal').exists()).to.be.false;
        expect(component.find('.lucid-modal-inner').exists()).to.be.false;
    });

    it('Renders header slot', () => {
        const component = createComponent(Component, props, {}, {
            header: "<h1>Header</h1>",
        });
        expect(component.find('.lucid-modal-header').find('h1').exists()).to.be.true;
    });

    it('Renders content slot', () => {
        const component = createComponent(Component, props, {}, {
            content: "<p>content</p>",
        });
        expect(component.find('.lucid-modal-content').find('p').exists()).to.be.true;
    });
   
});
