<template>
    <div class="lucid-checkbox" v-bind:class="classes" v-on:click="toggleChecked()" v-on:keyup.space="toggleChecked()" tabindex="1">
        <div class="lucid-checkbox-box" v-bind:style="boxStyles">
            <div class="lucid-checkbox-ripple"></div>
            <div class="lucid-checkbox-fill" v-bind:style="fillStyles">
                <div class="lucid-checkbox-tick"></div>
            </div>
        </div>
        <div class="lucid-checkbox-label">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, VModel, PropSync } from 'vue-property-decorator';

@Component({})
export default class LucidCheckbox extends Vue {

    @PropSync('checked', { type: Boolean, default:false }) checkedSynced!: boolean;
    @PropSync('disabled', { type: Boolean, default:false }) disabledSynced!: boolean;
    @PropSync('color', { type: String, default:"" }) colorSynced!: boolean;

    public toggleChecked () {
        if (!this.disabledSynced) {
            if (this.checkedSynced) {
                this.checkedSynced = false
                this.$emit('uncheck', false);
            } else {
                this.checkedSynced = true;
                this.$emit('check', true);
            }
        }
    }

    public get styles() {
        return `background-color: #${ this.colorSynced }`;
    }

    public get boxStyles() {
        return `outline-color: #${ this.colorSynced }`;
    }

    public get fillStyles() {
        return `background-color: #${ this.colorSynced }`;
    }

    public get classes() {
        let classes = [];
        classes.push('lucid-hover-dark');
        classes.push(this.checkedSynced ? 'lucid-checked' : '');
        classes.push(this.disabledSynced ? 'lucid-disabled' : '');
        return classes;
    }
}
</script>
<style lang="scss">
    .lucid-checkbox {
        position: relative;
        display: block;
        text-align: left;
        font-weight: 400;
        user-select: none;
        outline: none;
        cursor: pointer;
        visibility: visible;

        .lucid-checkbox-box {
            position: relative;
            display: inline-block;
            vertical-align: top;
            width: 24px;
            height: 24px;
            margin-right:15px;
            box-sizing:border-box;
            border-radius:3px;
            background-color: #d1d1d1;
            pointer-events: none;
            z-index: 1;
            
            .lucid-checkbox-ripple {
                position: absolute; 
                top:0; 
                left: 0;
                width:100%;
                height: 100%;
                border-radius:50%;
                overflow: hidden;
                transform:scale(2);
                opacity: 1;
                z-index: -1;
            }
        }

        .lucid-checkbox-fill {
            position:absolute;
            top:0px;
            left:0px;
            width:100%;
            height:100%;
            opacity:0;
            border-radius: inherit;
            transition: opacity 140ms;
            z-index:1;

            .lucid-checkbox-tick {
                position: absolute;
                top: 7px;
                left: 5px;
                width: 11px;
                height: 5px;
                border: 2px solid #fff;
                border-top-style: none;
                border-right-style: none;
                opacity: 1;
                box-sizing: content-box;
                transform-origin: 50% 50%;
                transform: rotate(-45deg);
                z-index:2;
            }

        }

        .lucid-checkbox-label {
            position: relative;
            display: inline-block;
            vertical-align: top;
            width: calc(100% - 41px);
            margin-top: 2px;
        }

        /** Disabled state */
        &.lucid-disabled {
            opacity: 0.6;
            pointer-events: none;
        }
        
        /** Checked state */
        &.lucid-checked  {
            .lucid-checkbox-fill {
                opacity:1;
            }
        }

        /** Hover, Active, Focus states */
        &.lucid-hover-light,
        &.lucid-hover-dark {
            .lucid-checkbox-box {
                &::before {
                    content:"";
                    position: absolute;
                    top:0;
                    left:0;
                    width: 100%;
                    height: 100%;
                    border-radius: inherit;
                    background-color: rgba(255,255,255,0.2);
                    opacity: 0;
                    z-index: 2;
                    transition: opacity 140ms;
                }
            }
        }
        &.lucid-hover-dark {
            .lucid-checkbox-box {
                &::before {
                    background-color: rgba(0,0,0,0.2);
                }
            }
        }
        &.lucid-hover-light,
        &.lucid-hover-dark {
            &:hover {
                .lucid-checkbox-box {
                    &::before {
                        opacity: 0.5;
                    }
                }
            }
            &:focus,
            &:active {
                .lucid-checkbox-box {
                    &::before {
                        opacity: 1;
                    }
                }

            }
        }
        &:focus  {
            .lucid-checkbox-box {
                outline-width: 1px;
                outline-style: dashed;
                outline-offset: 3px;
            }
        }

    }

</style>
