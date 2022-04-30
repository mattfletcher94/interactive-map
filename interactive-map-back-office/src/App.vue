<template>
	<div id="app">
		<transition name="slide-fade" mode="out-in">
			<router-view id="main-router-view"></router-view>
		</transition>
	</div>
</template>

<style lang="scss">


// Import vue bootstrap
@import 'scss/bootstrap-overrides.scss';
@import 'scss/vue-search-select.scss';
@import 'scss/variables.scss';
@import '../node_modules/bootstrap/scss/bootstrap';
@import '../node_modules/bootstrap-vue/src/index.scss';

html {
    position: relative;
	display: block;
	width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 14px;
}
body {
    position: relative;
	display: block;
	width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Poppins', sans-serif;
    color: theme-color("text");
}
#app {
	position: relative;
	display: block;
	width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #E6EAEA;
}
#app #main-router-view {
    &.slide-fade-enter-active {
        transition: opacity 200ms linear, transform 200ms cubic-bezier(.2,.5,.1,1);
    }

    &.slide-fade-leave-active {
        transition: opacity 200ms linear, transform 200ms cubic-bezier(.5,0,.7,.4);
    }

    &.slide-fade-enter {
        transform-origin: 50% 50%;
        transform: translateY(6px);
        opacity: 0;
    }

    &.slide-fade-leave-to {
        transform-origin: 50% 50%;
        transform: translateY(6px);
        opacity: 0;
    }
}
.btn {
    font-weight: 400;
}
</style>
