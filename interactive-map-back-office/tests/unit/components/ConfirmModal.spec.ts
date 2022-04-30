import { expect } from 'chai'
import { createComponent, cloneObject } from './helpers';
import Component from '@/components/ConfirmModal.vue'

describe('ConfirmModal.vue', () => {

    const props = { 
        open: true, 
        dissmissible: true,
        loading: false,
        width: 720,
        title: "Title", 
        message: "Message",
        confirm: "Confirm Button",
        confirmVariant: "danger",
        cancel: "Cancel Button",
        cancelVariant: "light"
    }

    it('Renders if open prop is true', async () => {
        const component = createComponent(Component, props);
        expect(component.find('.confirm-modal').exists()).to.be.true;
        expect(component.find('.confirm-modal-inner').exists()).to.be.true;
    });

    it('Does not render if open prop is false', () => {
        const p = cloneObject(props, { open: false });
        const component = createComponent(Component, p);
        expect(component.find('.confirm-modal').exists()).to.be.false;
        expect(component.find('.confirm-modal-inner').exists()).to.be.false;
    });

    it("Renders title correctly", () => {
        const p = cloneObject(props, { open: true });
        const component = createComponent(Component, p);
        expect(component.find('h5').text()).to.be.equal(props.title);
    });
    
    it("Renders message correctly", () => {
        const p = cloneObject(props, { open: true });
        const component = createComponent(Component, p);
        expect(component.find('p').exists()).to.be.true;
        expect(component.find('p').text()).to.be.equal(props.message);
    });
    

    it('Performs correct behaviour when loading prop is false', async () => {

        const p = cloneObject(props, { loading: false });
        const component = createComponent(Component, p);

        expect(component.find('.confirm-btn').element.getAttribute("disabled")).to.be.oneOf(["false", null]);
        expect(component.find('.cancel-btn').element.getAttribute("disabled")).to.be.oneOf(["false", null]);

        await component.find('.confirm-modal-backdrop').trigger('click');
        expect(component.emitted('cancel')).to.not.be.undefined;

        await component.find('.cancel-btn').trigger('click');
        expect(component.emitted('cancel')).to.not.be.undefined;

        await component.find('.confirm-btn').trigger('click');
        expect(component.emitted('confirm')).to.not.be.undefined;

    }); 
    
    it('Performs correct behaviour when loading prop is true', async () => {

        const p = cloneObject(props, { loading: true });
        const component = createComponent(Component, p);

        expect(component.find('.confirm-btn').element.getAttribute("disabled")).to.be.oneOf(["true", "disabled"]);
        expect(component.find('.cancel-btn').element.getAttribute("disabled")).to.be.oneOf(["true", "disabled"])

        await component.find('.confirm-modal-backdrop').trigger('click');
        expect(component.emitted('cancel')).to.be.undefined;

        await component.find('.cancel-btn').trigger('click');
        expect(component.emitted('cancel')).to.be.undefined;

        await component.find('.confirm-btn').trigger('click');
        expect(component.emitted('confirm')).to.be.undefined;
    }); 

});
