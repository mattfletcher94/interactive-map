<template>
    <div 
    :id="`map-marker-item-${this.marker.mapMarkerId}`"
    class="map-marker-item" 
    :class="this.marker.mapMarkerSelected ? 'map-marker-item-selected' : ''">
        <div class="map-marker-item-bar-loader mb-2" v-if="this.marker.mapMarkerBusy"></div>

        <!-- Header -->
        <div 
            class="map-marker-item-header"
            v-on:click="onHeaderClick"
            >
            <div class="map-marker-item-handle">
                <i class="fas fa-grip-lines"></i>
                </div>
            <div class="row no-gutters">
                <div class="col-1 align-self-center">
                    <p>
                        <i v-if="this.marker.mapMarkerLocked" class="fas fa-lock" style="font-size:14px!important;" :style="`color:#${this.computedMapKeyColor}`"></i>
                        <i v-else class="fas fa-map-marker-alt" :style="`color:#${this.computedMapKeyColor}`"></i>
                    </p>
                </div>
                <div class="col-9 align-self-center">
                    <p class="text-truncate pl-2">
                        <span class="text-danger" v-if="this.marker.mapMarkerDirty" style="font-size:10px;">(Unsaved)</span> {{ this.marker && this.marker.mapMarkerName ? this.marker.mapMarkerName : "Map marker" }}
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
        <b-collapse :visible="this.marker.mapMarkerSelected">
            <div class="map-marker-item-accordion-content">

                <!-- Form -->
                <b-form ref="saveChangesForm" class="map-marker-item-save-changes-form" @submit.stop.prevent="onSaveChanges">
                    
                    <!-- Error message -->
                    <b-alert 
                        class="mt-0 mb-3 px-2 py-1 text-center"
                        :show="marker.mapMarkerError.length > 0" 
                        variant="danger">
                        <p class="m-0"><small>Error: {{ marker.mapMarkerError }}</small></p>
                    </b-alert>

                    <!-- Form content -->
                    <div class="row">

                        <!-- Name Field -->
                        <div class="col-12">
                            <b-form-group 
                                class="m-0" 
                                label="Map Marker Name:"
                                label-size="sm">
                                <b-form-input 
                                    class="pr-0"
                                    v-model="mutableMarker.mapMarkerName" 
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    type="text" 
                                    size="sm" 
                                    v-on:input="onChange"/>
                            </b-form-group>
                        </div>

                        <!-- Key field -->
                        <div class="col-12 mt-3">
                            <b-form-group 
                                class="m-0" 
                                label="Key:"
                                label-size="sm">
                                <b-form-select :options="computedMapKeys" 
                                    v-model="mutableMarker.mapMarkerKey"
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    type="text" 
                                    size="sm" 
                                    v-on:input="onChange"/>
                            </b-form-group>
                        </div>

                        <!-- X Position field -->
                        <div class="col-6 mt-3">
                            <b-form-group 
                                class="m-0" 
                                label="X Position:"
                                label-size="sm">
                                <b-form-input 
                                    class="pr-0"
                                    v-model="mutableMarker.mapMarkerPositionX" 
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    type="number" 
                                    size="sm"
                                    v-on:input="onChange" />
                            </b-form-group>
                        </div>

                        <!-- Y Position field -->
                        <div class="col-6 mt-3">
                            <b-form-group 
                                class="m-0" 
                                label="Y Position:"
                                label-size="sm">
                                <b-form-input 
                                    class="pr-0"
                                    v-model="mutableMarker.mapMarkerPositionY" 
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    type="number" 
                                    size="sm"
                                    v-on:input="onChange" />
                            </b-form-group>
                        </div>

                        <!-- Divider -->
                        <div class="col-12">
                            <hr>
                        </div>

                        <!-- Title field -->
                        <div class="col-12">
                            <b-form-group 
                                class="m-0" 
                                label="Map Marker Title:"
                                label-size="sm">
                                <b-form-input 
                                    class="pr-0"
                                    v-model="mutableMarker.mapMarkerTitle" 
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    type="text" 
                                    size="sm" 
                                    v-on:input="onChange"/>
                            </b-form-group>
                        </div>

                        <!-- Title Display field -->
                        <div class="col-12 mt-3">
                            <b-form-group 
                                class="m-0" 
                                label="Title display type:"
                                label-size="sm">
                                <b-form-select
                                    v-model="mutableMarker.mapMarkerTitleDisplayType"
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    type="text" 
                                    size="sm" 
                                    v-on:input="onChange">
                                    <b-form-select-option value="never">Never</b-form-select-option>
                                    <b-form-select-option value="hover">Hover</b-form-select-option>
                                    <b-form-select-option value="always">Always</b-form-select-option>
                                </b-form-select>
                            </b-form-group>
                        </div>

                        <!-- Description field -->
                        <div class="col-12 mt-3">
                            <b-form-group 
                                class="m-0" 
                                label="Map Marker Description:"
                                label-size="sm">
                                <b-form-textarea 
                                    class="pr-0"
                                    v-model="mutableMarker.mapMarkerDescription" 
                                    :state="null" 
                                    :disabled="this.computedDisabledField"
                                    size="sm" 
                                    rows="8" 
                                    trim
                                    v-on:input="onChange"/>
                            </b-form-group>
                        </div>

                        <!-- Divider -->
                        <div class="col-12">
                            <hr>
                        </div>

                        <!-- Pitched unit selection -->
                        <div class="col-12" v-if="this.pitchedEnabled">
                            <b-form-group 
                                class="m-0" 
                                label="Pitched Booking Unit (optional):"
                                label-size="sm">
                                <model-select 
                                    :options="pitchedUnitsSelect"
                                    v-model="pitchedUnitSelected"
                                    :isDisabled="this.computedDisabledField"
                                    v-on:input="onChange"
                                    placeholder="select item">
                                </model-select>
                            </b-form-group>
                        </div>

                        <!-- Divider -->
                        <div class="col-12">
                            <hr>
                        </div>

                        <!-- Enable Button Field -->
                        <div class="col-12">
                            <b-form-group 
                                class="m-0" 
                                label="Map Marker Button:"
                                label-size="sm">
                                <b-form-checkbox 
                                    switch
                                    button-variant="secondary"
                                    v-model="mutableMarker.mapMarkerButtonEnabled" 
                                    :state="null"
                                    :disabled="this.computedDisabledField"
                                    v-on:input="onChange"
                                    size="sm">
                                    Enable
                                </b-form-checkbox>
                            </b-form-group>
                        </div>

                        <!-- Button Label field -->
                        <transition name="conditional-field-transition">
                            <div class="col-12 mt-3" v-if="mutableMarker.mapMarkerButtonEnabled">
                                <b-form-group 
                                    class="m-0" 
                                    label="Map Marker Button Label:"
                                    label-size="sm">
                                    <b-form-input 
                                        class="pr-0"
                                        v-model="mutableMarker.mapMarkerButtonLabel" 
                                        :state="null" 
                                        :disabled="this.computedDisabledField"
                                        type="text" 
                                        size="sm" 
                                        v-on:input="onChange"/>
                                </b-form-group>
                            </div>
                        </transition>

                        <!-- Button URL Field -->
                        <transition name="conditional-field-transition">
                            <div class="col-12 mt-3" v-if="mutableMarker.mapMarkerButtonEnabled">
                                <b-form-group 
                                    class="m-0" 
                                    label="Map Marker Button URL:"
                                    label-size="sm">
                                    <b-form-input 
                                        class="pr-0"
                                        v-model="mutableMarker.mapMarkerButtonURL" 
                                        :state="null" 
                                        :disabled="this.computedDisabledField"
                                        type="text" 
                                        size="sm" 
                                        v-on:input="onChange"/>
                                </b-form-group>
                            </div>
                        </transition>
                        
                        <!-- Divider -->
                        <div class="col-12">
                            <hr>
                        </div>

                        <!-- Enable Gallery field -->
                        <div class="col-12">
                            <b-form-group 
                                class="m-0" 
                                label="Gallery:"
                                label-size="sm">
                                <b-form-checkbox 
                                    switch
                                    button-variant="secondary"
                                    :state="null"
                                    v-model="mutableMarker.mapMarkerImagesEnabled" 
                                    :disabled="this.computedDisabledField"
                                    v-on:input="onChange"
                                    size="sm">
                                    Enable
                                </b-form-checkbox>
                            </b-form-group>
                        </div>

                        <!-- Gallery selection-->
                        <transition name="conditional-field-transition">
                            <div class="col-12 mt-3" v-if="mutableMarker.mapMarkerImagesEnabled">
                                <b-form-group 
                                    class="m-0" 
                                    label-size="sm">
                                    <media-library-field
                                        :upload="true"
                                        :selected="marker.mapMarkerImages"
                                        :multi-select="true"
                                        :disabled="this.computedDisabledField"
                                        v-on:change="onGallerySelectionChange"
                                    />
                                </b-form-group>
                            </div>
                        </transition>

                    <!-- /row -->
                    </div>

                    <!-- Divider -->
                    <hr>

                    <!-- Buttons -->
                    <div class="row no-gutters">
                        <b-list-group class="map-marker-item-btn-group w-100" horizontal>
                            <b-list-group-item 
                                :id="`map-marker-item-delete-btn-${this.marker.mapMarkerId}`"
                                class="flex-fill text-center"
                                :disabled="this.computedDisabledField"
                                href="#" 
                                title="Delete">
                                <i class="fas fa-trash"></i>
                                <b-popover v-if="!this.marker.mapMarkerBusy" :target="`map-marker-item-delete-btn-${this.marker.mapMarkerId}`" triggers="click blur" boundary="viewport" placement="right">
                                    <template #title>Please confirm</template>
                                    Please confirm that you wish to delete this map marker. This action cannot be undone.
							        <b-button v-on:click="onDeleteClick" class="mt-2 mb-1" variant="danger"  block :disabled="this.marker.mapMarkerBusy" size="sm">Yes, Delete this map marker</b-button>
                                </b-popover>
                            </b-list-group-item>
                            <b-list-group-item 
                                class="flex-fill text-center" 
                                :disabled="this.marker.mapMarkerBusy"
                                :active="this.marker.mapMarkerLocked" 
                                v-on:click="onLockClick"
                                href="#" 
                                :title="this.marker.mapMarkerLocked ? 'Locked' : 'Unlocked'">
                                <i v-if="this.marker.mapMarkerLocked" class="fas fa-lock"></i>
                                <i v-else class="fas fa-lock-open"></i>
                            </b-list-group-item>
                            <b-list-group-item 
                                class="flex-fill text-center" 
                                :disabled="!this.marker.mapMarkerDirty || this.marker.mapMarkerBusy"
                                href="#"
                                title="Save Changes"
                                v-on:click="$refs.submitChangesBtn.click()">
                                <i class="fas fa-save"></i>
                            </b-list-group-item>
                        </b-list-group>
                    </div>

                    <!-- Hidden save changes button -->
                    <input ref="submitChangesBtn" :disabled="!this.marker.mapMarkerDirty || this.marker.mapMarkerBusy" type="submit" hidden/>
                
                <!-- /b-form -->
                </b-form>

            <!-- /accordion-content -->
            </div>

        <!-- /b-collapse -->
        </b-collapse>
    </div>
</template>

<script lang="ts">
import ImageClient from '@/models/ImageModels/Image.client';
import MapKeyEditor from '@/models/MapKeyModels/MapKey.editor';
import MapMarkerEditor from '@/models/MapMarkerModels/MapMarker.editor';
import PitchedUnitClient from '@/models/PitchedUnitModels/PitchedUnit.client';
import clone from 'lodash.clone';
import { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class MapMarkerItem extends Vue {

    /**
     * Register map markers (DO NOT MUTATE)
     */
    @Prop({ type: MapMarkerEditor }) public readonly marker!: MapMarkerEditor

    /**
     * Register map keys (DO NOT MUTATE)
     */
    @Prop({ type: Array as PropType<Array<MapKeyEditor>>, default: () => [] }) public readonly keys!: Array<MapKeyEditor>

    /**
     * Register pitched units (DO NOT MUTATE)
     */
    @Prop({ type: Array as PropType<Array<MapKeyEditor>>, default: () => [] }) public readonly pitchedUnits!: Array<PitchedUnitClient>

    /**
     * Register pitched enabled
     */
    @Prop({ type: Boolean, default: false }) public readonly pitchedEnabled!: boolean


    /**
     * Create a clone of the marker (Use for form models)
     */
    private mutableMarker = clone(this.marker);

    /**
     * Set selected unit
     */
    public pitchedUnitSelected = this.mutableMarker.mapMarkerPitchedUnitSelection;


    /**
     * Any field change, mark as dirty
     */
    public async onChange() {
        this.mutableMarker.mapMarkerPitchedUnitSelection = this.pitchedUnitSelected;
        this.mutableMarker.mapMarkerPositionX = parseInt(this.mutableMarker.mapMarkerPositionX.toString());
        this.mutableMarker.mapMarkerPositionY = parseInt(this.mutableMarker.mapMarkerPositionY.toString());
        this.$emit('marker-change', this.mutableMarker);
    }

    /**
     * Handle gallery field change separately
     */
    public onGallerySelectionChange(images: ImageClient[]) {
        this.mutableMarker.mapMarkerImages = images;
        this.onChange();
    }

    /**
     * Handle clicking lock button
     */
    public onLockClick (e: Event) {
        if (!this.marker.mapMarkerLocked) {
            this.mutableMarker.mapMarkerLocked = true;
            //this.$emit('marker-locked', this.marker.mapMarkerId, true);
        } else {
            this.mutableMarker.mapMarkerLocked = false;

            //this.$emit('marker-locked', this.marker.mapMarkerId, false);
        }
        this.onChange();
    }

    /**
     * Handle clicking header 
     */
    public onHeaderClick (e: Event) {
        if (!this.marker.mapMarkerSelected) {
            this.$emit('marker-select', this.marker.mapMarkerId);
        } else {
            this.$emit('marker-select', null);
        }
    }

    /**
     * Save changes
     */
    public async onSaveChanges (e: Event) {
        this.$emit('marker-save', this.marker.mapMarkerId);
    }

    /**
     * Delete a map marker
     */
    public async onDeleteClick (e:  Event) {
        this.$emit('marker-delete', this.marker.mapMarkerId);
    }   

    /**
     * If a field should be disabled
     */
    public get computedDisabledField() {
        return this.marker.mapMarkerLocked || this.marker.mapMarkerBusy;
    }

    /**
     * Create an array for the map keys select
     */
    public get computedMapKeys() {
        const keys = this.keys.map((item) => {
            return {
                value: item.mapKeyId,
                text: item.mapKeyTitle,
            }
        });
        keys.unshift({
            value: "",
            text: "None"
        });
        return keys;
    }

    /**
     * Calculate color of the selected key
     */
    public get computedMapKeyColor() {
        const key = this.keys.find((m) => {
            return m.mapKeyId === this.marker.mapMarkerKey;
        });
        if (key) {
            return key.mapKeyColor;
        } else {
            return 'dc3545';
        }

    }

    public get pitchedUnitsSelect() {
        const selection = this.pitchedUnits.map((u) => {
            return {
                value: u.unitId.toString(),
                text: u.holidayTypeName + ' - ' + u.unitName
            }
        });
        selection.unshift({
            value: "",
            text: "None"
        });
        return selection;
    }


}

</script>
<style lang="scss">
@import '../scss/variables.scss';

.map-marker-item {
    position: relative;
    display: block;
    width: 100%;
    //background-color: #fff;
    //border: 1px solid #f1f1f1;
    //border: 1px solid #e9e9ef;
   // margin-bottom: 12px;
    transition: border-color 200ms;
    //background-color: #F8F8FA;
    color: theme-color("text");
    overflow: hidden;
    background-color: #fff;
    //border-bottom: 1px solid #e9e9ef;
    border-radius: 5px;
    margin: 6px 0px;

    &.map-marker-item-selected {
    
        i.fa-chevron-down {
            transform: rotate(-180deg)!important;
        }
    }

    &:hover {
        background-color:lighten(theme-color("primary"), 40%);
    }

    .conditional-field-transition-enter-active, 
    .conditional-field-transition-leave-active {
        transition: opacity 240ms, transform 240ms;
    }
    .conditional-field-transition-enter, 
    .conditional-field-transition-leave-to {
        transform: translateX(-6px);
        opacity: 0;
    }

    &.map-marker-item-selected {
        background-color:transparent!important;
        border: 1px solid theme-color("primary");
    }

    .map-marker-item-bar-loader {
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
            background-color:theme-color("primary");
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

    .map-marker-item-header {
        position: relative;
        display: block;
        width: 100%;
        padding: 18px 24px 18px 36px;
        outline: none!important;
        transition: background-color 100ms, border-color 100ms;
        cursor: pointer;
        background-color: transparent;

        .map-marker-item-handle {
            position: absolute;
            top: 0;
            left: 0;
            width: 30px;
            height: 100%;
            z-index: 10;
            cursor: grab;

            i {
                position: absolute;
                top: calc(50% - 8px);
                left: 0;
                width: 100%;
                height: 16px;
                line-height: 16px;
                text-align: center;
                color: lighten(theme-color("text"), 10%);
                transform: scaleX(0.5);
            }

            &:hover {
                background-color: rgba(0,0,0,0.05);
            }
        }

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

    .map-marker-item-accordion-content {
        position: relative;
        display: block;
        width: 100%;
        color: theme-color("text");
        padding: 18px 18px 18px 18px;
        border-top: 1px solid #e9e9ef;

        .map-marker-item-accordion-content-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.05;
        }

        .map-marker-item-save-changes-form {

            input[type=number],
            input[type=text],
            input[type=color],
            textarea,
            select {
                padding-right: 0px!important;
                background-image: none!important;

                &:focus {
                    border-color:theme-color("primary")!important;
                    box-shadow: 0 0 0 0.2rem rgba(theme-color("primary"), 0.2)!important;
                }

                &.is-valid {
                    border-color: #ced4da!important;

                    &:focus {
                        border-color:theme-color("primary")!important;
                        box-shadow: 0 0 0 0.2rem rgba(theme-color("primary"), 0.2)!important;
                    }
                }
            }

            .map-marker-item-btn-group {
                
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

        .gallery-items {
            position: relative;
            display: block;
            width: 100%;
            height: auto;
            font-size: 0px;

            .gallery-item {
                position: relative;
                display: inline-block;
                vertical-align: top;
                width: calc(100% / 3);
                height: 60px;
                border: 1px solid #fff;
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
            }
        }
    }
}
</style>
