import { expect } from 'chai'
import { createComponent, cloneObject } from './Helpers';
import Component from '@/components/PitchedWidget.vue'
import moment from 'moment';

describe('PitchedWidget.vue', () => {

    const props = { 
        busy: false, 
        invalidFeedback: "",
        holidayType: "all",
        arrivalDate: moment().format("YYYY-MM-DD"),
        duration: 7,
        partySize: 4,
    }

    it('Sets holiday type correctly', async () => {
        const component = createComponent(Component, props);
        expect((component.find('.holiday-type-select').element as HTMLSelectElement).value).to.equal('all');
    });

    it('Sets arrival date correctly', async () => {
        const component = createComponent(Component, props);
        //expect(component.find('output bdi:nth-child(2)').text()).to.equal(moment().format("DD/MM/YYYY"))
    });
   
    it('Sets duration correctly', async () => {
        const component = createComponent(Component, props);
        expect((component.find('.duration-select').element as HTMLSelectElement).value).to.equal('7')
    });
    
    it('Sets party size correctly', async () => {
        const component = createComponent(Component, props);
        expect((component.find('.party-size-select').element as HTMLSelectElement).value).to.equal('4')
    });

    it('Enableds fields when not busy', async () => {
        const component = createComponent(Component, props);
        expect((component.find('.holiday-type-select').element as HTMLSelectElement).disabled).to.be.false;
        expect((component.find('.duration-select').element as HTMLSelectElement).disabled).to.be.false;
        expect((component.find('.party-size-select').element as HTMLSelectElement).disabled).to.be.false;
        expect((component.find('.pitched-widget-search-btn').element as HTMLButtonElement).disabled).to.be.false;
        expect((component.find('.pitched-widget-clear-btn').element as HTMLButtonElement).disabled).to.be.false;
    });

    it('Disables fields when busy', async () => {
        const component = createComponent(Component, cloneObject(props, {busy: true}));
        expect((component.find('.holiday-type-select').element as HTMLSelectElement).disabled).to.be.true;
        expect((component.find('.duration-select').element as HTMLSelectElement).disabled).to.be.true;
        expect((component.find('.party-size-select').element as HTMLSelectElement).disabled).to.be.true;
        expect((component.find('.pitched-widget-search-btn').element as HTMLButtonElement).disabled).to.be.true;
        expect((component.find('.pitched-widget-clear-btn').element as HTMLButtonElement).disabled).to.be.true;
    });

    it('Emits the success event when filled in correctly', async () => {
        const component = createComponent(Component, props);
        await component.find('.pitched-widget-search-btn').trigger('click');
        const emitted = component.emitted('success') as any;
        expect(emitted[0][0].holidayType).to.equal(props.holidayType);
        expect(emitted[0][0].arrivalDate).to.equal(props.arrivalDate);
        expect(emitted[0][0].duration).to.equal(props.duration);
        expect(emitted[0][0].partySize).to.equal(props.partySize);
    });

    it('Emits the fail event when not filled in correctly', async () => {
        const component = createComponent(Component, cloneObject(props, { partySize: 0 }));
        await component.find('.pitched-widget-search-btn').trigger('click');
        const emitted = component.emitted('fail') as any;
        expect(emitted[0][0].holidayType).to.equal(props.holidayType);
        expect(emitted[0][0].arrivalDate).to.equal(props.arrivalDate);
        expect(emitted[0][0].duration).to.equal(props.duration);
        expect(emitted[0][0].partySize).to.equal(0);
    });
    
    it('Emits the clear event when the clear button is clicked', async () => {
        const component = createComponent(Component, props);
        await component.find('.pitched-widget-clear-btn').trigger('click');
        expect(component.emitted('clear')).to.not.be.undefined;
    });
});
