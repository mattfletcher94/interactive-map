<template>
    <transition name="lucid-modal" mode="out-in">
        <div class="lucid-modal" v-if="openSynced" :key="openSynced">
            <div class="lucid-modal-backdrop" v-on:click="clickBackdrop"></div>
            <transition name="lucid-modal-inner" appear>
                <div class='lucid-modal-inner' v-bind:style="`max-width: ${ this.widthSynced }px`" v-if="openSynced" :key="openSynced">
                    <div class="row no-gutters" :style="this.loadingSynced ? `opacity:0.75` : 'opacity:1'">
                        <div class="col-12">
                            <slot name="header"></slot>
                        </div>
                    </div>
                    <div class="row no-gutters mt-2">
                        <div class="col-12">
                            <slot name="content"></slot>
                        </div>
                    </div>
                    <div class="row no-gutters mt-2">
                        <div class="col-12">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Modal extends Vue {

    @PropSync('open', { type: Boolean, default:false }) openSynced!: boolean;
    @PropSync('dissmissible', { type: Boolean, default: true }) dissmissibleSynced!: boolean;
    @PropSync('loading', { type: Boolean, default: false }) loadingSynced!: boolean;
    @PropSync('width', { type: Number, default: 600 }) widthSynced!: number;
    
    public mounted() {

        // Move to end of body
        document.body.appendChild(this.$el);
    }

    public clickBackdrop (e: Event) {
        if (this.dissmissibleSynced) {
            this.openSynced = false;
        }
    }


}

</script>
<style lang="scss" >

@import '../scss/variables.scss';

.lucid-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 36px 20px;
    text-align: center;
    z-index: 999999;
    
    .lucid-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }

    .lucid-modal-inner {
        position: relative;
        display: inline-block;
        vertical-align: top;
        text-align: left;
        width:100%;
        height: auto;
        max-height: calc(100vh - 60px);
        transform-origin: 50% 0%;
        padding: 24px;
        background: #fff;
        border-radius: 2px;
        z-index: 2;
        box-shadow: 0 40px 77px rgba(0, 0, 0, 0.22), 0 27px 24px rgba(0, 0, 0, 0.2);
        overflow: hidden;


            
    }

}

.lucid-modal-enter-active {
    transition: opacity 240ms;
}

.lucid-modal-leave-active {
    transition: opacity 240ms;
}

.lucid-modal-enter {
    opacity: 0;
}

.lucid-modal-leave-to {
    opacity: 0;
}

.lucid-modal-inner-enter-active {
    transition: all 240ms cubic-bezier(.2,.5,.1,1);
}

.lucid-modal-inner-leave-active {
    transition: all 240ms cubic-bezier(.5,0,.7,.4);
}

.lucid-modal-inner-enter {
    transform: translateY(-12px) scale(0.975);
}

.lucid-modal-inner-leave-to {
    transform: translateY(0px);
}

</style>
