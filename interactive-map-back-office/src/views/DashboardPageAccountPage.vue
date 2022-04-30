<template>
<div
    class="d-block h-100">
    <div
        class="d-block overflow-auto h-100">
        <div
            class="d-block px-4 pt-4 mx-auto"
            style="max-width: 1200px">
			<b-card>
				<b-card-body>
					<b-card-title>Account Details</b-card-title>
					<b-card-sub-title class="mb-2">Please update your account details if necessary.</b-card-sub-title>
					<hr />
					<form-update-user 
						v-bind:busy="updateFormBusy"
						v-bind:invalid-feedback="updateFormInvalidFeedback"
						v-on:success="updateFormSuccess" 
					/>
				</b-card-body>
			</b-card>
        </div>
		<div
            class="d-block px-4 pt-4 mx-auto"
            style="max-width: 1200px">
			<b-card>
				<b-card-body>
					<b-card-title>Update Password</b-card-title>
					<b-card-sub-title class="mb-2">Passwords must be a minimum of 8 characters long. Please use a secure password.</b-card-sub-title>
					<hr />
					<form-update-password 
						v-bind:busy="updatePasswordFormBusy"
						v-bind:invalid-feedback="updatePasswordFormInvalidFeedback"
						v-on:success="updatePasswordFormSuccess" 
					/>

					<!--<b-button v-on:click="signOut" variant="primary">SIGN OUT</b-button>-->
				</b-card-body>
			</b-card>
        </div>
		<div
            class="d-block p-4 mx-auto"
            style="max-width: 1200px">
			<b-card>
				<b-card-body>
					<b-card-title>Delete Account</b-card-title>
					<b-card-sub-title class="mb-2">By deleting your account, all your data will be removed from our database. This cannot be undone.</b-card-sub-title>
					<hr />
					<b-button v-on:click="deleteSelfModalOpen = true" variant="danger">DELETE MY ACCOUNT</b-button>
				</b-card-body>
			</b-card>
        </div>
    </div>
	
    <!-- Delete account confirm modal -->
	<confirm-modal
		:open.sync="deleteSelfModalOpen"
		:loading.sync="deleteSelfModalBusy"
		:width="420"
		title="Please Confirm"
		message="Please confirm that you wish to delete your account. This action cannot be undone."
		confirm="Yes, delete my account"
		confirm-variant="danger"
		cancel="Cancel"
		v-on:confirm="deleteAccount"
		v-on:cancel="deleteSelfModalOpen = false">
	</confirm-modal>
</div>
</template>
<script lang="ts">
import UserClient from '@/models/UserModels/User.client';
import RepositoryFactory from '@/repositories/RepositoryFactory';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ })
export default class DashboardPageAccountPage extends Vue {

    @Prop({ type: UserClient }) public readonly user!: UserClient

	public deleteSelfModalOpen = false;
	public deleteSelfModalBusy = false;

	public updateFormBusy = false;
	public updateFormInvalidFeedback = "";

	public updatePasswordFormBusy = false;
	public updatePasswordFormInvalidFeedback = "";

    public signOut(e: any) {
        window.localStorage.removeItem('JWT');
        this.$router.push('/login/');
    }

	public async deleteAccount(e : any) {
		this.deleteSelfModalBusy = true;
		const repo = new RepositoryFactory().getUsersRepository();
		const resp = await repo.deleteSelf();
		this.deleteSelfModalBusy = false;
		this.deleteSelfModalOpen = false;
        window.localStorage.removeItem('JWT');
        this.$router.push('/login/');
	}

	public async updateFormSuccess(formModel: { userFirstName: string, userLastName: string, userEmail: string }) {
		
		// Form is now busy
        this.updateFormBusy = true;

        // Remove invalid message
        this.updateFormInvalidFeedback = "";

        // Make API request
        const repo = new RepositoryFactory().getUsersRepository();
        const { is200, is400 } = await repo.updateSelf(formModel);

        // If 200 status code
        if (is200) {
			
        }

        // Else if 400 status code
        else if (is400) {
            this.updateFormBusy = false;
            this.updateFormInvalidFeedback = is400.errors[0].message;
        }
		
        // Is now longer busy
        this.updateFormBusy = false;
	}

	public async updatePasswordFormSuccess(password: string) {

		// Form is now busy
        this.updatePasswordFormBusy = true;

        // Remove invalid message
        this.updatePasswordFormInvalidFeedback = "";

        // Make API request
        const repo = new RepositoryFactory().getUsersRepository();
        const { is200, is400 } = await repo.updateSelf({
			userPassword: password
		});

        // If 200 status code
        if (is200) {
			
        }

        // Else if 400 status code
        else if (is400) {
            this.updatePasswordFormBusy = false;
            this.updatePasswordFormInvalidFeedback = is400.errors[0].message;
        }
		
        // Is now longer busy
        this.updatePasswordFormBusy = false;
	}
}

</script>
<style lang="scss" scoped>

</style>