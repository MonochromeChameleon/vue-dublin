import Vue from 'vue';

import router from './js/routes';
import App from './app.vue';

new Vue({
  router,
  render: h => h(App)
}).$mount('#vue');
