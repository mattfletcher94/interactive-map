import Vue from 'vue'

import { 
    BAlert,
    BButton,
    BCalendar,
    BCarousel,
    BCarouselSlide,
    BFormGroup, 
    BFormSelect,
    BFormSelectOption,
    BSpinner,
    VBTooltip
} from 'bootstrap-vue'
//import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'

//Vue.use(BootstrapVue)

Vue.component('b-alert', BAlert)
Vue.component('b-button', BButton)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form-select', BFormSelect)
Vue.component('b-form-select-option', BFormSelectOption)
Vue.component('b-calendar', BCalendar)
Vue.component('b-spinner', BSpinner)
Vue.component('b-carousel', BCarousel)
Vue.component('b-carousel-slide', BCarouselSlide)
Vue.directive('b-tooltip', VBTooltip)