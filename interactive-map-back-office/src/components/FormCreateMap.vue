<template>
<div
    class="form-create-map">
    <b-form
        class="form"
        @submit.stop.prevent="onSubmit">
        <b-alert
            class="alert-invalid-feedback my-3"
            :show="invalidFeedback.length > 0"
            variant="danger">{{ invalidFeedback }}</b-alert>
        <b-form-group
            label="Map title">
            <b-form-input
                class="map-title-field"
                v-model="$v.form.mapTitle.$model"
                :state="validateFormFieldState('mapTitle')"
                :disabled="busy"
                type="text"></b-form-input>
            <b-form-invalid-feedback>This is a required field and must be between 4 and 255 characters.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            label="Map Description">
            <b-form-textarea
                class="map-description-field"
                v-model="$v.form.mapDescription.$model"
                :state="validateFormFieldState('mapDescription')"
                :disabled="busy"
                rows="3"
                max-rows="6"
                trim></b-form-textarea>
            <b-form-invalid-feedback>Maximum of 255 characters.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            label="Map Image"
            :state="validateFormFieldState('mapImage')"
            invalid-feedback="Please select an image from your media library.">
            <media-library
                :multi-select="false"
                :uploadable="true"
                v-on:select="onSelectImage"></media-library>
        </b-form-group>
        <b-form-group
            class="text-right">
            <b-button
                class="create-map-btn mt-4"
                variant="primary"
                type="submit"
                :disabled="busy">Create Map</b-button>
        </b-form-group>
    </b-form>
    <overlay-loader
        message="Saving map..."
        :show.sync="busy"
        :opacity="0.9" />
</div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import RepositoryFactory from "@/repositories/RepositoryFactory";
import MapCreate from '@/models/MapModels/Map.create';
import ImageClient from '@/models/ImageModels/Image.client';
import clone from 'lodash.clone'

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
            mapImage: {
                required,
            }
        }
    },
})
export default class FormCreateMap extends Vue {

    @Prop({ type: Boolean, default: false }) public readonly busy!: boolean
    @Prop({ type: String, default: "" }) public readonly invalidFeedback!: string

    /**
     * Create map form
     */
    public form = {
        mapTitle: "",
        mapDescription: "",
        mapImage: [] as Array <string>
    }

    /**
     * Validate a form control
     */
    public validateFormFieldState(name: string) {
        const { $dirty, $error } = this.$v.form[name] as any;
        return $dirty ? !$error : null;
    }

    /**
     * Submit form
     */
    public async onSubmit() {

        // Emit submit
        this.$emit('submit', {
            mapTitle: this.form.mapTitle,
            mapDescription: this.form.mapDescription,
            mapImage: this.form.mapImage[0]
        });

        // Check if form is valid and if not
        // then return out of function
        this.$v.$touch();
        if (this.$v.$invalid) {
            this.$emit('fail', {
                mapTitle: this.form.mapTitle,
                mapDescription: this.form.mapDescription,
                mapImage: this.form.mapImage[0]
            })
            return null;
        }

        // Emit the before submit event
        this.$emit('success', {
            mapTitle: this.form.mapTitle,
            mapDescription: this.form.mapDescription,
            mapImage: this.form.mapImage[0]
        });

    }

    public onSelectImage(imageIds: string[], imageClients: ImageClient[]) {
        this.form.mapImage = imageIds;
    }

}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.form-create-map {
    position: relative;
    display: block;
    width: 100%;

    form {
        padding: 2px;
    }

}
</style>
