import Vue from "vue";
import App from "./App.vue";
import "jquery/dist/jquery";
import router from "./routes/routes";
import store from "./store/store";
import "./registerServiceWorker";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
