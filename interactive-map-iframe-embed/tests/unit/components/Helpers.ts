import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import LucidModal from '../../../src/components/LucidModal.vue'
import LucidCheckbox from '../../../src/components/LucidCheckbox.vue'
import PitchedWidget from '../../../src/components/PitchedWidget.vue'
import Ripple from '../../../src/directives/ripple';

const createComponent = (vueComponent: any, props = {}, data = {}, slots = {}) => {
    const localVue = createLocalVue()
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons)
    localVue.component('lucid-modal', LucidModal);
    localVue.component('lucid-checkbox', LucidCheckbox);
    localVue.component('pitched-widget', PitchedWidget);
    localVue.directive('ripple', Ripple);

    return mount(vueComponent, {
        localVue: localVue,
        propsData: {
            ...props
        },
        data: () => data,
        slots: slots,
    });
}

const createComponentShallow = (vueComponent: any, props = {}, data = {}, slots = {}) => {
    const localVue = createLocalVue()
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons)
    localVue.component('lucid-modal', LucidModal);
    localVue.component('lucid-checkbox', LucidCheckbox);
    localVue.component('pitched-widget', PitchedWidget);
    localVue.directive('ripple', Ripple);

    return shallowMount(vueComponent, {
        localVue: localVue,
        propsData: {
            ...props
        },
        data: () => data,
        slots: slots,
    });
}

const cloneObject = (defaults = {}, overrides = {}) => {
    return Object.assign({}, defaults, overrides) as any;
}

export { createComponent, createComponentShallow, cloneObject }