import Vue from 'vue'
import './registerServiceWorker'
import './plugins/bootstrap-vue'
import './directives/ripple'
import App from './App.vue'
import router from './router'
import store from './store'
import Ripple from './directives/ripple';

// Import and register custom components
import LucidCheckbox from './components/LucidCheckbox.vue'
import LucidModal from './components/LucidModal.vue';
import MapRenderer from './components/MapRenderer.vue';
import PitchedWidget from './components/PitchedWidget.vue';
Vue.component('lucid-checkbox', LucidCheckbox);
Vue.component('lucid-modal', LucidModal);
Vue.component('map-renderer', MapRenderer);
Vue.component('pitched-widget', PitchedWidget);

// Register directives
Vue.directive('ripple', Ripple);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
