<template>
<div class="form-update-password">
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
            label="Password"
            invalid-feedback="This is a required field and must be at least 8 characters long.">
            <b-form-input
                class="password-field"
                v-model="$v.form.userPassword.$model"
                :state="validateFormFieldState('userPassword')"
                type="password"
                :disabled="busy">
            </b-form-input>
        </b-form-group>
        <b-form-group
            label="Confirm Password"
            invalid-feedback="Password do not match.">
            <b-form-input
                class="password-confirm-field"
                v-model="$v.form.userPasswordConfirm.$model"
                :state="validateFormFieldState('userPasswordConfirm')"
                type="password"
                :disabled="busy">
            </b-form-input>
        </b-form-group>
		<b-button
            class="update-password-btn mt-4"
            variant="primary"
            type="submit"
            :disabled="busy">
            UPDATE PASSWORD
        </b-button>
    </b-form>
    <overlay-loader
        message="Updating password..."
        :show="busy"
        :opacity="0.9" />
</div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate'
import { minLength, required, sameAs } from "vuelidate/lib/validators";
import clone from 'lodash.clone'

@Component({
    mixins: [validationMixin],
    validations: {
        form: {
            userPassword: {
				minLength: minLength(8),
                required,
            },
			userPasswordConfirm: {
				minLength: minLength(8),
                required,
				sameAsPassword: sameAs('userPassword')
            }
        }
    },
})
export default class FormUpdateUser extends Vue {

    @Prop({ type: Boolean, default: false }) public readonly disabled!: boolean
    @Prop({ type: Boolean, default: false }) public readonly busy!: boolean
    @Prop({ type: String, default: "" }) public readonly invalidFeedback!: string
   

    /**
     * Register form 
     */
    public form = {
		userPassword: "",
		userPasswordConfirm: "",
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
        this.$emit('submit', this.form.userPassword);

        // Check if form is valid and if not
        // then return out of function
        this.$v.$touch();
        if (this.$v.$invalid) {
            this.$emit('fail', this.form.userPassword)
            return null;
        }

        // Emit the before submit event
        this.$emit('success', this.form.userPassword);

    }

}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.form-update-password {
    position: relative;
    display: block;
    width: 100%;

    form {
        padding: 4px;
    }

}
</style>
