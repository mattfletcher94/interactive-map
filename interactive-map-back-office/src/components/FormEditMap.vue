<template>
<div
    class="form-edit-map">
    <b-form
        class="form"
        @submit.stop.prevent="onSubmit">
        <b-alert
            class="alert-invalid-feedback my-3"
            :show="invalidFeedback.length > 0"
            variant="danger">{{ invalidFeedback }}</b-alert>
        <b-form-group
            label="Map title"
            label-size="sm">
            <b-form-input
                class="map-title-field"
                :disabled="busy"
                :state="validateFormFieldState('mapTitle')"
                v-model="$v.form.mapTitle.$model"
                v-on:input="dirty = true"
                type="text"
                size="sm" />
            <b-form-invalid-feedback>This is a required field and must be between 4 and 255 characters.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            label="Map Description"
            label-size="sm">
            <b-form-textarea
                class="map-description-field"
                :disabled="busy"
                :state="validateFormFieldState('mapDescription')"
                v-model="$v.form.mapDescription.$model"
                v-on:input="dirty = true"
                rows="3"
                max-rows="6"
                trim
                size="sm" />
            <b-form-invalid-feedback>Maximum of 255 characters.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            label="Map Image:"
            label-size="sm"
            :state="validateFormFieldState('mapImage')"
            invalid-feedback="Please select an image from your media library.">
            <media-library-field
                :upload="true"
                :selected="$v.form.mapImage.$model"
                :multi-select="false"
                v-on:change="onMediaLibraryFieldChange" />
            <b-form-invalid-feedback>Please select one image from your media library.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            label="Pitched Booking integration:"
            label-size="sm">
            <b-form-checkbox
                switch
                size="sm"
                class="map-pitched-booking-enabled-field"
                :disabled="busy"
                v-model="$v.form.mapPitchedBookingEnabled.$model"
                v-on:change="dirty = true"
                :state="null">
                Enable
            </b-form-checkbox>
        </b-form-group>
        <b-form-group
            v-if="$v.form.mapPitchedBookingEnabled.$model == true"
            label="Pitched Booking URL:"
            label-size="sm">
            <b-form-input
                size="sm"
                type="text"
                class="map-pitched-booking-url-field"
                v-model="$v.form.mapPitchedBookingURL.$model"
                :disabled="busy"
                :state="validateFormFieldState('mapPitchedBookingURL')"
                v-on:input="dirty = true" />
        </b-form-group>
        <b-form-group
            class="text-right"
            label-size="sm">
            <b-button
                size="sm"
                class="submit-form-btn mt-2 btn-flat btn-flat-primary"
                type="submit"
                :disabled="busy || !dirty">
                Save Changes
            </b-button>
        </b-form-group>
    </b-form>
    <overlay-loader
        message="Saving Changes..."
        :show.sync="busy"
        :opacity="0.9" />
</div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, requiredIf } from "vuelidate/lib/validators";
import ImageClient from '@/models/ImageModels/Image.client';
import MapClient from '@/models/MapModels/Map.client';

@Component({
    mixins: [validationMixin],
    validations: {
        form: {
            mapTitle: {
                required,
                minLength: minLength(4),
                maxLength: maxLength(255),
            },
            mapDescription: {
                maxLength: maxLength(255),
            },
            mapPitchedBookingEnabled: {},
            mapPitchedBookingURL: {
                required: requiredIf(function (form) {
                    return form.mapPitchedBookingEnabled;
                })
            },
            mapImage: {
                required,
            }
        }
    },
})
export default class FormEditMap extends Vue {

    
    @Prop({ type: MapClient, required: true }) readonly map!: MapClient
    @Prop({ type: Boolean, default: false }) public readonly busy!: boolean
    @Prop({ type: String, default: "" }) public readonly invalidFeedback!: string

    /**
     * If fields have been changed
     */
    public dirty = false;

    /**
     * Update map form
     */
    public form = {
        mapTitle: "",
        mapDescription: "",
        mapPitchedBookingEnabled: false,
        mapPitchedBookingURL: "",
        mapImage: [] as Array <ImageClient>
    }

    /**
     * Mounted hook
     */
    public async mounted() {
        this.form.mapTitle = this.map.mapTitle as string;
        this.form.mapDescription = this.map.mapDescription as string;
        this.form.mapPitchedBookingEnabled = this.map.mapPitchedBookingEnabled;
        this.form.mapPitchedBookingURL = this.map.mapPitchedBookingURL;
        if (this.map.mapImage) {
            this.form.mapImage.push(this.map.mapImage);
        }
    }

    /**
     * Validate a form control
     */
    public validateFormFieldState(name: string) {
        if (name === 'mapImage') {
            if (this.form.mapImage.length > 0)
                return true;
            else {
                return false;
            }
        } else {
            const { $dirty, $error } = this.$v.form[name] as any;
            return $dirty ? !$error : null;
        }
    }

    /**
     * Submit form
     */
    public async onSubmit() {

        // Emit submit
        this.$emit('submit', {
            mapTitle: this.form.mapTitle,
            mapDescription: this.form.mapDescription,
            mapImage: this.form.mapImage[0].imageId,
            mapPitchedBookingEnabled: this.form.mapPitchedBookingEnabled,
            mapPitchedBookingURL: this.form.mapPitchedBookingURL,
        });

        // Check if form is valid and if not
        // then return out of function
        this.$v.$touch();
        if (this.$v.$invalid) {
            this.$emit('fail', {
                mapTitle: this.form.mapTitle,
                mapDescription: this.form.mapDescription,
                mapImage: this.form.mapImage[0].imageId,
                mapPitchedBookingEnabled: this.form.mapPitchedBookingEnabled,
                mapPitchedBookingURL: this.form.mapPitchedBookingURL,
            });
            return;
        }

        // Emit the before submit event
        this.$emit('success', {
            mapTitle: this.form.mapTitle,
            mapDescription: this.form.mapDescription,
            mapImage: this.form.mapImage[0].imageId,
            mapPitchedBookingEnabled: this.form.mapPitchedBookingEnabled,
            mapPitchedBookingURL: this.form.mapPitchedBookingURL,
        });

    }

    public onMediaLibraryFieldChange(imageClients: ImageClient[]) {
        this.dirty = true;
        this.form.mapImage = imageClients;
    }

}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.form-edit-map {

    .bar-loader {
        position: relative;
        display: block;
        width: 100%;
        height: 4px;
        overflow: hidden;
        background-color: #f1f1f1;

        &::before {
            position: absolute;
            display: block;
            content: "";
            left: -50%;
            width: 50%;
            height: 100%;
            background-color: theme-color("secondary");
            animation: barLoader 2s linear infinite;

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
</style>
