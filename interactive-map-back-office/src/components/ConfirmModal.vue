<template>
    <transition name="confirm-modal" mode="out-in">
        <div class="confirm-modal" v-if="open" :key="open">
            <div class="confirm-modal-backdrop" v-on:click="onClickBackdrop"></div>
            <transition name="confirm-modal-inner" appear>
                <div class='confirm-modal-inner' v-bind:style="`max-width: ${ this.width }px`" v-if="open" :key="open">
                    <div class="bar-loader" v-if="this.loading"></div>
                    <div class="row no-gutters" :style="this.loading ? `opacity:0.75` : 'opacity:1'">
                        <div class="col-12">
                            <h5>{{ this.title }}</h5>
                            <p v-if="this.message">{{ this.message }}</p>
                        </div>
                    </div>
                    <div class="row no-gutters mt-2">
                        <div class="col-12 text-right">
							<b-button class="confirm-btn" :variant="confirmVariant" block v-on:click="clickConfirmButton" :disabled="this.loading">{{ this.confirm }}</b-button>
							<b-button class="cancel-btn" :variant="cancelVariant" block v-on:click="clickCancelButton" :disabled="this.loading">{{ this.cancel }}</b-button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';

@Component({})
export default class ConfirmModal extends Vue {

    @PropSync('open', { type: Boolean, default:false }) openSynced!: boolean;
    @PropSync('loading', { type: Boolean, default: false }) loadingSynced!: boolean;
    @PropSync('width', { type: Number, default: 600 }) widthSynced!: number;
    @PropSync('title', { type: String, default: "Please Confirm" }) titleSynced!: string;
    @PropSync('message', { type: String, default: "" }) messageSynced!: string;
    @PropSync('confirm', { type: String, default: "Confirm" }) confirmSynced!: string;
    @PropSync('confirm-variant', { type: String, default: "secondary" }) confirmVariantSynced!: string;
    @PropSync('cancel', { type: String, default: "Cancel" }) cancelSynced!: string;
    @PropSync('cancel-variant', { type: String, default: "light" }) cancelVariantSynced!: string;


    public onClickBackdrop(e: Event) {
        if (!this.loadingSynced) {
            this.openSynced = false;
            this.$emit('cancel');
        }
    }

    public clickConfirmButton (e: Event) {
        if (!this.loadingSynced) {
            this.$emit('confirm');
        }
    }
    
    public clickCancelButton (e: Event) {
        if (!this.loadingSynced) {
            this.$emit('cancel');
        }
    }

}
</script>
<style lang="scss">
@import '../scss/variables.scss';

.confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 36px 20px;
    text-align: center;
    z-index: 9997;
    
    .confirm-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }

    .confirm-modal-inner {
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

        .bar-loader {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            overflow: hidden;
            background-color: #f1f1f1;

            &::before {
                position:absolute;
                display:block;
                content:"";
                left:-50%;
                width:50%;
                height:100%;
                background-color: theme-color("secondary");
                animation:barLoader 2s linear infinite;

                @keyframes barLoader {
                    from {
                        left: -50%; 
                        width: 50%;
                    }
                    50% {
                        width: 30%;
                    }
                    70% {
                        width: 70%;
                    }
                    80% { 
                        left: 50%;
                    }
                    95% {
                        left: 120%;
                    }
                    to {
                        left: 100%;
                    }
                }
            }
        }

            
    }

}

.confirm-modal-enter-active {
    transition: opacity 240ms;
}

.confirm-modal-leave-active {
    transition: opacity 240ms;
}

.confirm-modal-enter {
    opacity: 0;
}

.confirm-modal-leave-to {
    opacity: 0;
}

.confirm-modal-inner-enter-active {
    transition: all 240ms cubic-bezier(.2,.5,.1,1);
}

.confirm-modal-inner-leave-active {
    transition: all 240ms cubic-bezier(.5,0,.7,.4);
}

.confirm-modal-inner-enter {
    transform: translateY(-12px) scale(0.975);
}

.confirm-modal-inner-leave-to {
    transform: translateY(0px);
}

</style>
