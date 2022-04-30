import { expect } from 'chai'
import { createComponent, cloneObject } from './Helpers';
import Component from '@/components/LucidCheckbox.vue'

describe('LucidCheckbox.vue', () => {

    const props = { 
        checked: true, 
        disabled: true,
        color: '#ff4747',
    }

    const slots = {
        default: "My checkbox",
    }

    it('Adds checked class when checked', async () => {
        const component = createComponent(Component, props, {}, slots);
        expect(component.classes()).to.contain('lucid-checked');
    });

    it('Removes checked class when unchecked', async () => {
        const component = createComponent(Component, cloneObject(props, { checked: false }), {}, slots);
        expect(component.classes()).to.not.contain('lucid-checked');
    });

    it('Adds disabled class when disabled', async () => {
        const component = createComponent(Component, cloneObject(props, { disabled: true }), {}, slots);
        expect(component.classes()).to.contain('lucid-disabled');
    });

    it('Removes disabled class when not disabled', async () => {
        const component = createComponent(Component, cloneObject(props, { disabled: false }), {}, slots);
        expect(component.classes()).to.not.contain('lucid-disabled');
    });

    it('Renders default slot content', async () => {
        const component = createComponent(Component, cloneObject(props, { disabled: false }), {}, slots);
        expect(component.find('.lucid-checkbox-label').text()).to.equal(slots.default);
    });
   
});
