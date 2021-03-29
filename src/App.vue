<template>
	<div class="container-fluid" id="app">
		<router-view>
			<Home />
		</router-view>
	</div>
</template>

<script>
import Home from "./containers/Home.vue";

export default {
	name: "App",
	components: {
		Home,
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 20px;
}
</style>
