<template>
    <transition name="overlay-loader" appear>
        <div class="overlay-loader" v-if="show" :style="computedStyling">
            <div class="row no-gutters h-100">
                <div class="col-12 align-self-center text-center">
                    <p class="mb-3" v-if="message">{{ message }}</p>
                    <b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Spinning"></b-spinner>
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';

@Component({})
export default class OverlayLoader extends Vue {

    @PropSync('show', { type: Boolean }) showSynced!: boolean

    @PropSync('message', { type: String }) messageSynced!: string

    @PropSync('opacity', { type: Number, default: 0.9 }) opacitySynced!: number

    /**
     * Computed property for styling
     */
    get computedStyling(): string {
        return `background-color: rgba(255,255,255,${ this.opacitySynced })`;
    }

}

</script>
<style lang="scss">
    @import '../scss/variables.scss';

    .overlay-loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height:100%;
        z-index: 20;
        background-color: #FFF;
        transition: opacity 240ms cubic-bezier(.2,.5,.1,1);

        &-enter,
        &-leave-to {
            opacity: 0;
        }

    }

</style>
