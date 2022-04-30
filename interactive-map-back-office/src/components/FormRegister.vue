<template>
<div class="form-register">
    <b-form
        class="form"
        @submit.stop.prevent="onSubmit">
        <b-alert
            class="alert-invalid-feedback my-3"
            :show="invalidFeedback.length > 0"
            variant="danger">
            {{ invalidFeedback }}
        </b-alert>
		<b-form-group
            label="First Name"
            invalid-feedback="This is a required field.">
            <b-form-input
                class="first-name-field"
                v-model="$v.form.userFirstName.$model"
                :state="validateFormFieldState('userFirstName')"
                type="text"
                :disabled="busy">
            </b-form-input>
        </b-form-group>
		<b-form-group
            label="Last Name"
            invalid-feedback="This is a required field.">
            <b-form-input
                class="last-name-field"
                v-model="$v.form.userLastName.$model"
                :state="validateFormFieldState('userLastName')"
                type="text"
                :disabled="busy">
            </b-form-input>
        </b-form-group>
        <b-form-group
            label="Email address"
            invalid-feedback="This is a required field.">
            <b-form-input
                class="email-field"
                v-model="$v.form.userEmail.$model"
                :state="validateFormFieldState('userEmail')"
                type="email"
                :disabled="busy">
            </b-form-input>
        </b-form-group>
        <b-form-group
            label="Password"
            invalid-feedback="This is a required field.">
            <b-form-input
                class="password-field"
                v-model="$v.form.userPassword.$model"
                :state="validateFormFieldState('userPassword')"
                type="password"
                :disabled="busy">
            </b-form-input>
        </b-form-group>
        <b-button
            class="sign-in-btn mt-4"
            block
            variant="primary"
            type="submit"
            :disabled="busy">
            REGISTER
        </b-button>
    </b-form>
    <overlay-loader
        message="Registering account..."
        :show="busy"
        :opacity="0.9" />
</div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate'
import { required } from "vuelidate/lib/validators";
import clone from 'lodash.clone'

@Component({
    mixins: [validationMixin],
    validations: {
        form: {
			userFirstName: {
                required,
            },
			userLastName: {
                required,
            },
            userEmail: {
                required,
            },
            userPassword: {
                required,
            }
        }
    },
})
export default class FormLogin extends Vue {

    @Prop({ type: Boolean, default: false }) public readonly disabled!: boolean
    @Prop({ type: Boolean, default: false }) public readonly busy!: boolean
    @Prop({ type: String, default: "" }) public readonly invalidFeedback!: string

    /**
     * Register form 
     */
    public form = {
		userFirstName: "",
		userLastName: "",
        userEmail: "",
        userPassword: "",
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
        this.$emit('submit', clone(this.form));

        // Check if form is valid and if not
        // then return out of function
        this.$v.$touch();
        if (this.$v.$invalid) {
            this.$emit('fail', clone(this.form))
            return null;
        }

        // Emit the before submit event
        this.$emit('success', clone(this.form));

    }

}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.form-register {
    position: relative;
    display: block;
    width: 100%;

    form {
        padding: 4px;
    }

}
</style>
