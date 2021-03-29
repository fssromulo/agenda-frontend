import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../../src/containers/Home";

Vue.use(VueRouter);
const routes = [
	{
		path: "/home",
		component: Home,
		name: "Home",
	},
	{ path: "*", redirect: "/home" },
];

const router = new VueRouter({
	mode: "history",
	routes,
});

export default router;
