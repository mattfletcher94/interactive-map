<template>
    <div class="pitched-widget">
        <div class="container h-100" style="position:relative">
            <div class="row no-gutters h-100 justify-content-center">
                <div class="col-12 mt-1" v-if="invalidFeedback.length > 0">
                    <b-alert
                        class="alert-invalid-feedback m-0"
                        :show="true"
                        variant="danger">{{ invalidFeedback }}
                    </b-alert>
                </div>
                <div class="col-12 mt-3 d-none">
                    <b-form-group 
                        class="m-0">
                        <b-form-select
                            class="holiday-type-select"
                            :state="selectedHolidayTypeState"
                            :disabled="busy"
                            v-model="holidayTypeSynced"
                            v-on:input="selectedHolidayTypeChange">
                            <b-form-select-option value="">Holiday Type</b-form-select-option>
                            <b-form-select-option value="all">All</b-form-select-option>
                            <b-form-select-option value="caravan">Accommodation</b-form-select-option>
                            <b-form-select-option value="luxury_lodge">Luxury Lodge</b-form-select-option>
                            <b-form-select-option value="touring">Touring</b-form-select-option>
                            <b-form-select-option value="camping">Camping</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                </div>
                <div class="col-12 mt-3">
                    <b-form-group 
                        :state="selectedArrivalDateState"
                        invalid-feedback="Please select an arrival date"
                        class="m-0">
                            <b-calendar 
                                class="arrival-date-select calendar"
                                :disabled="busy"
                                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                                :min="minArrivalDate"
                                :show-decade-nav="false"
                                :hide-header="true"
                                nav-button-variant="primary"
                                :no-highlight-today="true"
                                block
                                v-model="arrivalDateSynced"
                                v-on:input="selectedArrivalDateChange">
                                <template v-slot:nav-next-year></template>
                                <template v-slot:nav-prev-year></template>
                                <template v-slot:nav-next-month>Next<i class="fas fa-chevron-right ml-2"></i></template>
                                <template v-slot:nav-prev-month><i class="fas fa-chevron-left mr-2"></i>Prev</template>
                                <template v-slot:nav-this-month></template>
                            </b-calendar>
                    </b-form-group>
                </div>
                <div class="col-12 mt-3">
                    <b-form-group 
                        class="m-0" 
                        :state="selectedDurationState"
                        invalid-feedback="Please select a duration">
                        <b-form-select
                            class="duration-select"
                            :state="selectedDurationState"
                            :disabled="busy"
                            v-model="durationSynced"
                            v-on:input="selectedDurationChange">
                            <b-form-select-option :value="0">Holiday Duration</b-form-select-option>
                            <b-form-select-option :value="3">3 Nights</b-form-select-option>
                            <b-form-select-option :value="7">7 Nights</b-form-select-option>
                            <b-form-select-option :value="14">14 Nights</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                </div>
                <div class="col-12 mt-3">
                    <b-form-group 
                        :state="selectedDurationState"
                        invalid-feedback="Please select your party size">
                        <b-form-select
                            class="party-size-select"
                            :state="selectedPartySizeState"
                            :disabled="busy"
                            v-model="partySizeSynced"
                            v-on:input="selectedPartySizeChange">
                            <b-form-select-option :value="0">Party Size</b-form-select-option>
                            <b-form-select-option :value="1">1 Person</b-form-select-option>
                            <b-form-select-option :value="2">2 People</b-form-select-option>
                            <b-form-select-option :value="3">3 People</b-form-select-option>
                            <b-form-select-option :value="4">4 People</b-form-select-option>
                            <b-form-select-option :value="5">5 People</b-form-select-option>
                            <b-form-select-option :value="6">6 People</b-form-select-option>
                            <b-form-select-option :value="7">7 People</b-form-select-option>
                            <b-form-select-option :value="8">8 People</b-form-select-option>
                            <b-form-select-option :value="9">9 People</b-form-select-option>
                            <b-form-select-option :value="10">10 People</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                </div>
                <div class="col-12 mt-3">
                    <b-button 
                        class="pitched-widget-search-btn px-0"
                        v-if="!busy"
                        :disabled="busy"
                        variant="primary" 
                        v-ripple="'rgba(255,255,255,0.5)'"
                        pill
                        v-on:click="onSubmit">
                        Check Availability
                    </b-button>
                    <b-button 
                        class="pitched-widget-search-btn px-0"
                        v-else
                        :disabled="true"
                        variant="primary" 
                        v-ripple="'rgba(255,255,255,0.5)'"
                        pill>
                        <b-spinner variant="light" label="Spinning" style="margin-top:5px!important;"></b-spinner>
                    </b-button>
                </div>
                <div class="col-12 mt-3">
                    <b-button 
                        class="pitched-widget-clear-btn px-0"
                        :disabled="busy"
                        variant="primary" 
                        v-ripple="'rgba(33, 105, 246, 0.75)'"
                        pill
                        v-on:click="onClear">
                        Clear
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ICheckAvailability from '@/models/PitchedModels/CheckAvailability';
import RepositoryFactory from '@/repositories/RepositoryFactory';
import { Component, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class PitchedWidget extends Vue {

    @Prop({ type: Boolean, default: false }) public readonly busy!: boolean;
    @Prop({ type: String, default: "" }) public readonly invalidFeedback!: string

    @PropSync('holidayType', { type: String, default: 'all' }) holidayTypeSynced!: string;
    @PropSync('arrivalDate', { type: String, default: '' }) arrivalDateSynced!: string;
    @PropSync('duration', { type: Number, default: 0 }) durationSynced!: number;
    @PropSync('partySize', { type: Number, default: 0 }) partySizeSynced!: number;


    public selectedHolidayTypeState: boolean | null = null;
    public selectedDurationState: boolean | null = null;
    public selectedPartySizeState: boolean | null = null;
    public selectedArrivalDateState: boolean | null = null;

    public widgetRequestRunning: boolean = false;
    public minArrivalDate = new Date();

    public mounted() {

    }

    public async onSubmit() {

        // Reset all field states
        this.selectedHolidayTypeState = null;
        this.selectedDurationState = null;
        this.selectedArrivalDateState = null;
        this.selectedPartySizeState = null;

        // Set field states as error if needed
        if (this.holidayTypeSynced === "") {
            this.selectedHolidayTypeState = false;
        }
        if (this.durationSynced === 0) {
            this.selectedDurationState = false;
        }   

        if (!this.arrivalDateSynced) {
            this.selectedArrivalDateState = false;
        }
        if (this.partySizeSynced === 0) {
            this.selectedPartySizeState = false;
        }

        // Check all fields were filled in correctly
        if (this.holidayTypeSynced !== "" &&
            this.durationSynced !== 0 &&
            this.arrivalDateSynced &&
            this.partySizeSynced !== 0) {
                this.$emit('success', {
                    holidayType: this.holidayTypeSynced,
                    arrivalDate: this.arrivalDateSynced,
                    duration: this.durationSynced,
                    partySize: this.partySizeSynced
                } as ICheckAvailability);
        } else {
            this.$emit('fail', {
                holidayType: this.holidayTypeSynced,
                arrivalDate: this.arrivalDateSynced,
                duration: this.durationSynced,
                partySize: this.partySizeSynced
            } as ICheckAvailability);
        }

    }

    public onClear() {
        this.holidayTypeSynced = "all";
        this.arrivalDateSynced = "";
        this.durationSynced = 0;
        this.partySizeSynced = 0;
        this.$emit('clear', {
            holidayType: this.holidayTypeSynced,
            arrivalDate: this.arrivalDateSynced,
            duration: this.durationSynced,
            partySize: this.partySizeSynced
        } as ICheckAvailability);
    }

    public selectedHolidayTypeChange() {
        this.selectedHolidayTypeState = null;
    }

    public selectedDurationChange() {
        this.selectedDurationState = null;
    }

    public selectedArrivalDateChange() {
        this.selectedArrivalDateState = null;
    }

    public selectedPartySizeChange() {
        this.selectedPartySizeState = null;
    }

}

</script>
<style lang="scss" >

@import '../scss/variables.scss';

.pitched-widget {
    position: relative;
    display: block;
    width: 100%;
    height: auto;

    >.container {
        padding: 0px!important;
    }
    
    .pitched-widget-search-btn {
        width: 100%;
    }
    .pitched-widget-clear-btn {
        width: 100%;
    }
    .pitched-widget-bar-loader {
        top: 0px!important;
        bottom: auto;   
    }

    .form-group.is-invalid {

        .calendar .b-calendar-grid {
            border: 1px solid #d34a4f!important;

            &:active,
            &:hover,
            &:focus {
                box-shadow: 0 0 0 0.2rem rgb(211 74 79 / 25%);
            }
        }
    }

    .calendar {
        font-weight: 400;

        .b-calendar-grid-caption {
            font-weight: 600!important;
            padding: 6px!important;
            border-bottom: 1px solid #ced4da;
        }

        .b-calendar-grid-body .col[data-date] .btn {
            font-weight: 400!important;
        }

        .b-calendar-grid-help {
            display: none!important;
        }

        .b-calendar-nav {
            position: absolute;
            top: 0px;
            left: 0;
            width: 100%;
            height: 34px;
            //border: 1px solid #ced4da;
            margin-bottom: 0px;
            //border-top-left-radius: 0.25rem!important;
            //border-top-right-radius: 0.25rem!important;
            overflow: hidden;

            button:nth-child(1),
            button:nth-child(3),
            button:nth-child(5) {
                display: none!important;
            }
            
            button:nth-child(2),
            button:nth-child(4) {
                position: absolute;
                top: 0;
                left: 0;
                width: 60px;
                height: 36px;
                outline: none!important;
                border: none!important;
                box-shadow: none!important;
                border-radius: 0px!important;

                &:hover,
                &:active,
                &:focus {
                    background-color: rgba(theme-color("primary"), 0.25)!important;
                    color: theme-color("primary")!important;
                }
            }

            button:nth-child(4) {
                left: auto;
                right: 0;
            }

        }

        .b-calendar-grid {
            border: 1px solid #ced4da;
            //border-top: none!important;
            //border-top-left-radius: 0px!important;
            //border-top-right-radius: 0px!important;
            //border-bottom-left-radius: 0.25rem!important;
            //border-bottom-right-radius: 0.25rem!important;

            .btn-light {
                background-color: #FFF!important;
                outline: none!important;
            }
        }

    }

    .pitched-widget-search-btn {
        position: relative;
        background-color:theme-color("primary")!important;
        color: theme-color("white")!important;
        padding: 0px 24px;
        height: 36px;
        line-height: 36px;
        border: none!important;
        outline: none !important;
        
        &:hover,
        &:active,
        &:focus {
            background-color:darken(theme-color("primary"), 10%)!important;
            outline: none!important;
            border: none!important;
            box-shadow: none !important;
        }
        
        @include breakpoint($lg-down) {
            font-size: 13px!important;
        }

    }

    .pitched-widget-clear-btn {
        position: relative;
        background-color:rgba(theme-color("primary"), 0.15)!important;
        color: theme-color("primary")!important;
        box-shadow: none !important;
        padding: 0px 24px;
        height: 36px;
        line-height: 36px;
        border: none!important;
        outline: none !important;

        &:hover,
        &:active,
        &:focus {
            background-color:rgba(theme-color("primary"), 0.25)!important;
            outline: none!important;
            border: none!important;
            box-shadow: none !important;
        }
        
        @include breakpoint($lg-down) {
            font-size: 13px!important;
        }

    }
    .b-form-btn-label-control.form-control[aria-disabled=true], 
    .b-form-btn-label-control.form-control[aria-readonly=true] {
        background-color:#FFF!important;
        opacity: 0.75!important;
    }

}


</style>
