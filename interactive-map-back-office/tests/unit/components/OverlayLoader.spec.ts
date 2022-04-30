import { expect } from 'chai'
import { createComponent } from './helpers';
import OverlayLoader from '@/components/OverlayLoader.vue'

describe('OverlayLoader.vue', () => {

    it('Renders if show prop is true', () => {
        const props = { show: true, message: "Loading", opacity: 0.75 }
        const component = createComponent(OverlayLoader, props);
        expect(component.find('.overlay-loader').exists()).to.be.true;
    });

    it('Does not render if show prop is false', () => {
        const props = { show: false, message: "Loading", opacity: 0.75 }
        const component = createComponent(OverlayLoader, props);
        expect(component.find('.overlay-loader').exists()).to.be.false;
    });
    
    it('Displays message prop', () => {
        const props = { show: true, message: "Loading", opacity: 0.75 }
        const component = createComponent(OverlayLoader, props);
        expect(component.find('p').exists()).to.be.true;
        expect(component.find('p').text()).to.be.equal(props.message);
    });

    it('Does not render message if prop is empty', () => {
        const props = { show: true, message: "", opacity: 0.75 }
        const component = createComponent(OverlayLoader, props);
        expect(component.find('p').exists()).to.be.false;
    });

    
    it('Displays background opacity correctly', () => {
        const props = { show: true, message: "Loading", opacity: 0.75 }
        const component = createComponent(OverlayLoader, props);
        expect(component.find('.overlay-loader').element.style.backgroundColor).to.be.equal(`rgba(255, 255, 255, ${ props.opacity })`);
    });

});
