<template>
    <transition name="lucid-modal" mode="out-in">
        <div class="lucid-modal" v-if="openSynced" :key="openSynced">
            <div class="lucid-modal-backdrop" v-on:click="clickBackdrop"></div>
            <transition name="lucid-modal-inner" appear>
                <div class='lucid-modal-inner' v-bind:style="`max-width: ${ this.widthSynced }px`" v-if="openSynced" :key="openSynced">
                    <div class="lucid-modal-header" ref="modalHeader">
                        <div class="row no-gutters p-3">
                            <div class="col-10 align-self-center">
                                <slot name="header"></slot>
                            </div>
                            <div class="col-2 text-right align-self-center">
                                <b-button v-on:click="clickBackdrop" size="sm" variant="link" class="lucid-modal-close-btn">
                                    <i class="fas fa-times"></i>
                                </b-button>
                            </div>
                        </div>
                    </div>
                    <div class="lucid-modal-content" ref="modalContent">
                        <div class="row no-gutters p-3">
                            <div class="col-12">
                                <slot name="content"></slot>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class LucidModal extends Vue {

    @Ref('modalHeader') modalHeader!: HTMLElement;
    @Ref('modalContent') modalContent!: HTMLElement;

    @PropSync('open', { type: Boolean, default:false }) openSynced!: boolean;
    @PropSync('dissmissible', { type: Boolean, default: true }) dissmissibleSynced!: boolean;
    @PropSync('width', { type: Number, default: 600 }) widthSynced!: number;
    
    public mounted() {
        document.body.appendChild(this.$el);
    }

    public clickBackdrop (e : Event) {
        if (this.dissmissibleSynced) {
            this.openSynced = false;
        }
    }

    
    @Watch('openSynced')
    public openWatcher(val: boolean) {
        if (this.openSynced) {
            this.$nextTick(() => {
                if (this.modalContent) {
                    const el = this.$el as HTMLElement;
                    this.modalContent.style.maxHeight = (el.offsetHeight - this.modalHeader.offsetHeight - 60) + 'px';
                }
            });
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
    width: 100%;
    height: 100%;
    padding: 30px 12px;
    text-align: center;
    z-index: 999999;
    
    .lucid-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
    }

    .lucid-modal-inner {
        position: relative;
        display: inline-block;
        vertical-align: top;
        text-align: left;
        width:100%;
        height: auto;
        max-height: 100%;
        transform-origin: 50% 0%;
        background: #fff;
        border-radius: 2px;
        z-index: 2;
        box-shadow: 0 40px 77px rgba(0, 0, 0, 0.22), 0 27px 24px rgba(0, 0, 0, 0.2);
        overflow: hidden;

        .lucid-modal-header {
            position: relative;
            display: block;
            width: 100%;

            &::before {
                content: "";
                position: absolute;
                bottom: 0;
                left: 1rem;
                width: calc(100% - 2rem);
                height: 1px;
                background-color: #e1e1e1;
            }

            .lucid-modal-close-btn  {
                font-size: 20px;
                padding: 0px;
                width: 30px;
                height: 30px;
                line-height: 27px;
                text-align: center;
                border-radius: 50%;
                border: none;
                outline: none!important;
                box-shadow: none!important;
                color: theme-color("text");

                &:hover {
                    color: theme-color("text");
                    background-color:rgba(0,0,0,0.1);
                }

                &:active,
                &:focus {
                    color: theme-color("text");
                    background-color:rgba(0,0,0,0.3);
                }

            }
        }
            
        .lucid-modal-content {
            position: relative;
            display: block;
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
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
