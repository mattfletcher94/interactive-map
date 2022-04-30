<template>
	<div class="login-page d-block h-100">
		<b-container>
			<b-row class="justify-content-center mt-5" style="position:relative;z-index:2;">
				<b-col class="col-12 col-md-6 col-lg-6">
					<div class="brand-card">
						<div class="row no-gutters justify-content-center">
							<div class="col-12 text-center">
								<i class="brand-card-logo fas fa-map-marked-alt"></i>
							</div>
							<div class="col-12 text-center">
								<h3 class="brand-card-text">Interactive Holiday Park Map</h3>
							</div>
						</div>
						<!--
						<i class="brand-card-logo fas fa-map-marked-alt"></i>
						<div class="brand-card-text">Interactive Map</div>
						-->
					</div>
				</b-col>
			</b-row>
			<b-row class="justify-content-center mt-3" style="position:relative;z-index:1;">
				<b-col class="col-12 col-md-6 col-lg-6">
					<div id="login-card" class="p-0">
						<b-tabs active-nav-item-class="login-card-tab-active" justified>
							<b-tab title="LOG IN" active>
								<form-login 
									class="p-5"
									v-bind:busy="loginFormBusy"
									v-bind:invalid-feedback="loginFormInvalidFeedback"
									v-on:success="loginSuccess" 
								/>
							</b-tab>
							<b-tab title="REGISTER">
								<form-register 
									class="p-5"
									v-bind:busy="registerFormBusy"
									v-bind:invalid-feedback="registerFormInvalidFeedback"
									v-on:success="registerSuccess" 
								/>
							</b-tab>
						</b-tabs>
					</div>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script lang="ts">
import RepositoryFactory from '@/repositories/RepositoryFactory';
import { Component, Vue } from 'vue-property-decorator';


@Component({ })
export default class LoginPage extends Vue {

    public loginFormBusy = false;
    public loginFormInvalidFeedback = "";
	public registerFormBusy = false;
	public registerFormInvalidFeedback = "";

    /**
     * On successfull login
     */
    public async loginSuccess (formModel: { userEmail: string; userPassword: string }) {
        
        // Form is now busy
        this.loginFormBusy = true;

        // Remove invalid message
        this.loginFormInvalidFeedback = "";

        // Make API request
        const repo = new RepositoryFactory().getUsersRepository();
        const { is200, is400 } = await repo.login(formModel.userEmail, formModel.userPassword);

        // Is now longer busy
        this.loginFormBusy = false;

        // If 200 status code
        if (is200) {
            window.localStorage.setItem('JWT', is200.data.token);
            this.$router.push('/dashboard/maps/');
        }

        // Else if 400 status code
        else if (is400) {
            this.loginFormBusy = false;
            this.loginFormInvalidFeedback = is400.errors[0].message;
        }

    }
	
    /**
     * On successfull REGISTER
     */
    public async registerSuccess (formModel: { userFirstName: string, userLastName: string, userEmail: string; userPassword: string }) {
        
        // Form is now busy
        this.registerFormBusy = true;

        // Remove invalid message
        this.registerFormInvalidFeedback = "";

        // Make API request
        const repo = new RepositoryFactory().getUsersRepository();
        const { is201, is400 } = await repo.create(formModel);


        // If 200 status code
        if (is201) {
			const { is200, is400 } = await repo.login(formModel.userEmail, formModel.userPassword);
			if (is200) {
				window.localStorage.setItem('JWT', is200.data.token);
				this.$router.push('/dashboard/maps/');
			}
        }

        // Else if 400 status code
        else if (is400) {
            this.registerFormBusy = false;
            this.registerFormInvalidFeedback = is400.errors[0].message;
        }
		
        // Is now longer busy
        this.registerFormBusy = false;

    }

}

</script>

<style lang="scss" >
	@import '../scss/variables.scss';

	.login-page {
		&::before {
			content:"";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: url('~@/assets/parkmap.jpg') no-repeat center;
			background-size: 150%;
			filter: blur(20px);
		}
		&::after {
			content:"";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color:rgba(0,0,0,0.4)
		}
	}

	.brand-card {
		position: relative;
		display: block;
		width: 100%;
		font-size: 0;
		pointer-events: none;

		.brand-card-logo {
			position: relative;
			display: inline-block;
			vertical-align: top;
			width: 72px;
			height: 72px;
			line-height: 70px;
			font-size: 42px;
			color: #FFF;
			text-align: center;
			border-radius: 50%;
			z-index: 2;
		}

		.brand-card-text {
			position: relative;
			display: inline-block;
			vertical-align: top;
			margin-top: -12px;
			font-size: 24px;
			padding: 12px 24px;
			color: #FFF;
			font-weight: 300;
			z-index: 1;
		}
	}

	

	#login-card {
        position: relative;
        display: block;
        width: 100%;
        background-color: #FFF;
        border-radius: 5px;
		overflow: hidden;
		box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        z-index: 2;


		.nav-tabs {
            border-bottom: 0px solid transparent;
        }

        .nav-tabs .nav-link {
            border: 0px solid transparent;
        }

        .nav-link {
            border-radius: 0px!important;
            padding: 1.5rem 1.5rem;
            font-weight: 600;
            background-color: #e1e1e1;
            color: theme-color("text")!important;

            &.login-card-tab-active {
                background-color: #FFF;
            }
        }
	}
</style>
