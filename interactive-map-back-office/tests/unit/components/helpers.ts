import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate';
import OverlayLoader from '../../../src/components/OverlayLoader.vue'
import MediaLibrary from '../../../src/components/MediaLibrary.vue'
import MediaLibraryField from '../../../src/components/MediaLibraryField.vue'
import Modal from '../../../src/components/Modal.vue'

const createComponent = (vueComponent: any, props = {}, data = {}) => {
    const localVue = createLocalVue()
    localVue.use(BootstrapVue);
    localVue.use(Vuelidate);
    localVue.component('overlay-loader', OverlayLoader);
    localVue.component('media-library', MediaLibrary);
    localVue.component('media-library-field', MediaLibraryField);
    localVue.component('modal', Modal);
    return mount(vueComponent, {
        localVue: localVue,
        propsData: {
            ...props
        },
        data: () => data
    });
}

const createComponentShallow = (vueComponent: any, props = {}, data = {}, slots = {}) => {
    const localVue = createLocalVue()
    localVue.use(BootstrapVue);
    localVue.use(Vuelidate);
    localVue.component('overlay-loader', OverlayLoader);
    localVue.component('media-library', MediaLibrary);
    localVue.component('media-library-field', MediaLibraryField);
    localVue.component('modal', Modal);
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

export { createComponent, cloneObject, createComponentShallow }