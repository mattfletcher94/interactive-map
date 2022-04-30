import Vue from 'vue'
import './registerServiceWorker'
import './plugins/bootstrap-vue'
import './plugins/vuelidate'
import './plugins/vue-search-select'
import App from './App.vue'
import router from './router'
import store from './store'

// Import plugin components
import draggable from 'vuedraggable';
Vue.component('draggable', draggable);


// Import and register custom components
import ConfirmModal from './components/ConfirmModal.vue';
import FormLogin from './components/FormLogin.vue';
import FormRegister from './components/FormRegister.vue';
import FormUpdateUser from './components/FormUpdateUser.vue';
import FormUpdatePassword from './components/FormUpdatePassword.vue';
import FormCreateMap from './components/FormCreateMap.vue';
import FormEditMap from './components/FormEditMap.vue';
import MapCard from './components/MapCard.vue';
import MediaLibrary from './components/MediaLibrary.vue';
import MediaLibraryField from './components/MediaLibraryField.vue';
import MapMarkerItem from './components/MapMarkerItem.vue';
import MapKeyItem from './components/MapKeyItem.vue';
import OverlayLoader from './components/OverlayLoader.vue';
import Modal from './components/Modal.vue';
import MapRenderer from './components/MapRenderer.vue';
Vue.component('modal', Modal);
Vue.component('confirm-modal', ConfirmModal);
Vue.component('form-login', FormLogin);
Vue.component('form-register', FormRegister);
Vue.component('form-update-user', FormUpdateUser);
Vue.component('form-update-password', FormUpdatePassword);
Vue.component('form-create-map', FormCreateMap);
Vue.component('form-edit-map', FormEditMap);
Vue.component('map-card', MapCard);
Vue.component('overlay-loader', OverlayLoader);
Vue.component('media-library', MediaLibrary);
Vue.component('media-library-field', MediaLibraryField);
Vue.component('map-marker-item', MapMarkerItem);
Vue.component('map-key-item', MapKeyItem);
Vue.component('map-renderer', MapRenderer);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
