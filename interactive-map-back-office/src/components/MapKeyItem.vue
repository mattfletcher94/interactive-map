<template>
    <div class="map-key-item" :class="this.isOpen ? 'map-key-item-selected' : ''">
        <div class="map-key-item-bar-loader mb-2" v-if="this.mapKey.mapKeyBusy"></div>

        <!-- Header -->
        <div class="map-key-item-header" v-b-toggle="`map-key-item-${this.mapKey.mapKeyId}`">
            <div class="row no-gutters">
                <div class="col-1 align-self-center">
                    <p class="m-0">
                        <i class="fas fa-circle" :style="`color:#${this.mapKey.mapKeyColor}`"></i>
                    </p>
                </div>
                <div class="col-9 align-self-center">
                    <p class="text-truncate m-0 pl-2">
                        <span class="text-danger" v-if="this.mapKey.mapKeyDirty">(Unsaved)</span> {{ this.mapKey && this.mapKey.mapKeyTitle ? this.mapKey.mapKeyTitle : "Key" }}
                    </p>
                </div>
                <div class="col-2 align-self-center text-right">
                    <p>
                        <i class="fas fa-chevron-down"></i>
                    </p>
                </div>
            </div>
        </div>

        <!-- Content -->
        <b-collapse :id="`map-key-item-${this.mapKey.mapKeyId}`" v-model="isOpen">
            <div class="map-key-item-accordion-content">
                <b-form class="map-key-item-save-changes-form" @submit.stop.prevent="onSaveChanges">
                    <b-alert 
                        class="mt-0 mb-3 px-2 py-1 text-center"
                        :show="mapKey.mapKeyError.length > 0" 
                        variant="danger">
                        <p class="m-0"><small>Error: {{ mapKey.mapKeyError }}</small></p>
                    </b-alert>
                    <div class="row">
                        <div class="col-12">
                            <b-form-group 
                                class="m-0" 
                                label="Map Key Title:"
                                label-size="sm">
                                <b-form-input 
                                    class="pr-0"
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    v-model="mutableMapKey.mapKeyTitle"
                                    type="text" 
                                    size="sm" 
                                    v-on:input="onChange"/>
                            </b-form-group>
                        </div>
                        <div class="col-12 mt-3">
                            <b-form-group 
                                class="m-0" 
                                label="Map Key Colour:"
                                label-size="sm">
                                <b-form-input 
                                    class="pr-0"
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    v-model="computedColorModel"
                                    type="color" 
                                    size="sm"
                                    v-on:input="onChange" />
                            </b-form-group>
                        </div>
                    </div>
                    <hr>
                    <div class="row no-gutters">
                        <b-list-group class="map-key-item-btn-group w-100" horizontal>
                            <b-list-group-item 
                                :id="`map-key-item-delete-btn-${this.mapKey.mapKeyId}`"
                                class="flex-fill text-center"
                                :disabled="this.computedDisabledField"
                                href="#" 
                                title="Delete">
                                <i class="fas fa-trash"></i>
                                <b-popover v-if="!this.mapKey.mapKeyBusy" :target="`map-key-item-delete-btn-${this.mapKey.mapKeyId}`" triggers="click blur" boundary="viewport" placement="right">
                                    <template #title>Please confirm</template>
                                    Please confirm that you wish to delete this key. This action cannot be undone.
                                    <b-button v-on:click="onDeleteClick" class="mt-2 mb-1" variant="danger"  block :disabled="this.computedDisabledField" size="sm">Yes, Delete this item</b-button>
                                </b-popover>
                            </b-list-group-item>
                            <b-list-group-item 
                                class="flex-fill text-center" 
                                :disabled="!this.mapKey.mapKeyDirty || this.mapKey.mapKeyBusy"
                                href="#"
                                title="Save Changes"
                                v-on:click="$refs.submitChangesBtn.click()">
                                <i class="fas fa-save"></i>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                    <input ref="submitChangesBtn" :disabled="!this.mapKey.mapKeyDirty || this.mapKey.mapKeyBusy" type="submit" hidden/>
                </b-form>
            </div>
        </b-collapse>






        
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapKeyEditor from '@/models/MapKeyModels/MapKey.editor';
import clone from 'lodash.clone';

@Component({})
export default class MapKeyItem extends Vue {

    /**
     * Register map key (DO NOT MUTATE)
     */
    @Prop({ type: MapKeyEditor }) public readonly mapKey!: MapKeyEditor

    /**
     * Create a clone of the marker (Use for form models)
     */
    private mutableMapKey = clone(this.mapKey);

    private isOpen = false;
        
    /**
     * Any field change
     */
    public async onChange() {
        this.$emit('map-key-change', this.mutableMapKey);
    }

    /**
     * Save changes
     */
    public async onSaveChanges (e: Event) {
        this.$emit('map-key-save', this.mapKey.mapKeyId);
    }

    /**
     * Delete a map marker
     */
    public async onDeleteClick (e:  Event) {
        this.$emit('map-key-delete', this.mapKey.mapKeyId);
    }   


    /**
     * If a field should be disabled
     */
    public get computedDisabledField() {
        return this.mapKey.mapKeyBusy;
    }


    /**
     * Getter for Computed color model
     */
    public get computedColorModel() {
        return '#' + this.mutableMapKey.mapKeyColor;
    }

    /**
     * Setter for computed color model
     */
    public set computedColorModel(val: string) {
        this.mutableMapKey.mapKeyColor
        this.mutableMapKey.mapKeyColor = val.replace('#','');
    }


}

</script>
<style lang="scss">
@import '../scss/variables.scss';

.map-key-item {
    position: relative;
    display: block;
    width: 100%;
    transition: border-color 200ms;
    color: theme-color("text");
    overflow: hidden;
    background-color: #fff;
    border-radius: 5px;
    margin: 6px 0px;

    &:hover {
        background-color:lighten(theme-color("primary"), 40%);
    }

    &.map-key-item-selected {
        background-color:transparent!important;
        border: 1px solid theme-color("primary");
        
        i.fa-chevron-down {
            transform: rotate(-180deg)!important;
        }
    }
    
    .map-key-item-bar-loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        overflow: hidden;

        &::before {
            content:"";
            position:absolute;
            display:block;
            left:-50%;
            width:50%;
            height:100%;
            background-color:theme-color("secondary");
            animation:mapMarkerItemBarLoader 1s linear infinite;

            @keyframes mapMarkerItemBarLoader {
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

    .map-key-item-header {
        position: relative;
        display: block;
        width: 100%;
        padding: 18px;
        outline: none!important;
        transition: background-color 100ms, border-color 100ms;
        cursor: pointer;
        background-color: transparent;

        p {
            margin: 0!important;
            font-weight: 400!important;
            pointer-events: none;
            font-size: 13px;
            color: theme-color("text")
        }

        i {
            font-size: 16px!important;
            pointer-events: none;
        }

        i.fa-chevron-down {
            font-size: 12px!important;
            color: darken(#6C7D8B, 10%);
            transform: rotate(0deg);
            transition: transform 200ms;
        }

    }

    .map-key-item-accordion-content {
        position: relative;
        display: block;
        width: 100%;
        color: theme-color("text");
        padding: 18px 18px 18px 18px;
        border-top: 1px solid #e9e9ef;
    }

    .map-key-item-save-changes-form {

        input[type=number],
        input[type=text],
        input[type=color],
        textarea {
            padding-right: 0px!important;
            background-image: none!important;


            &.is-valid {
                border-color: #ced4da!important;

                &:focus {
                    border-color: #517dd6!important;
                    box-shadow: 0 0 0 0.2rem rgb(32 66 135 / 25%)!important;
                }
            }
        }

        .map-key-item-btn-group {

            .list-group-item {
                background-color: #F8F8FA;
                color: darken(#6C7D8B, 10%);
                padding: 0.5rem!important;
                border-color: darken(#F8F8FA, 5%)!important;

                &:hover {
                    background-color:darken(#F8F8FA, 5%)!important;
                    border-color: darken(#F8F8FA, 5%)!important;
                }

                &.active {
                    background-color:#F8F8FA!important;
                    border-color: darken(#F8F8FA, 5%)!important;
                }

                &.disabled {
                    color: lighten(#6C7D8B, 30%)!important;
                }

            }   

        }
        
    }

}
</style>
