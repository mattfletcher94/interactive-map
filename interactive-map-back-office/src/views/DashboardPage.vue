<template>
    <div class="dashboard-page">
        <div class="dashboard-page-sidebar">
            <div class="dashboard-page-sidebar-header">
                <b-row class="h-100">
                    <b-col class="col-12 align-self-center">
                        <h6 class="m-0 w-100 text-left"><i class="fas fa-map-marked-alt mr-2"></i></h6>
                    </b-col>
                </b-row>
            </div>
            <b-list-group class="dashboard-page-sidebar-list">
                <b-list-group-item class="item">
                    <b-link to="/dashboard/maps"><i class="fas fa-map-marker-alt mr-3"></i> My Maps</b-link>
                </b-list-group-item>
                <b-list-group-item>
                    <b-link to="/dashboard/account"><i class="fas fa-user mr-3"></i> {{ this.user ? this.user.userFirstName + ' ' + this.user.userLastName : '' }}</b-link>
                </b-list-group-item>
				<b-list-group-item>
                    <b-button variant="link" v-on:click="signOut"><i class="fas fa-sign-out-alt mr-3"></i> Log out</b-button>
                </b-list-group-item>
				<!--
                <b-list-group-item>
                    <b-link to="/dashboard/help"><i class="fas fa-question-circle mr-3"></i> Help</b-link>
                </b-list-group-item>
				-->
            </b-list-group>
        </div>
        <div class="dashboard-page-title-bar">
            <b-row class="h-100">
                <b-col class="col-12 align-self-center">
                    <b-breadcrumb :items="$route.meta.breadcrumbs" class="m-0"></b-breadcrumb>
                </b-col>
            </b-row>
        </div>
        <div class="dashboard-page-content">
            <transition name="zoom-fade" mode="out-in">
                <router-view class="router-view" v-bind:user="this.user"></router-view>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RepositoryFactory from "@/repositories/RepositoryFactory";
import UserClient from '@/models/UserModels/User.client';

@Component({ })
export default class DashboardPage extends Vue {

    /**
     * Current user
     */
    public user: UserClient | null = null;

    /**
     * On component mounted hook
     */
    public async mounted() {
        const repo = new RepositoryFactory().getUsersRepository();
        const resp = await repo.getSelf();
        if (resp.is200) {
            this.user = new UserClient({
				...resp.is200.data
			});
        } else if (resp.is404) {
			window.localStorage.removeItem('JWT');
			this.$router.push('/login/').catch(failure => {});
		}
    }

    public signOut(e: any) {
        window.localStorage.removeItem('JWT');
        this.$router.push('/login/');
    }

}
</script>
<style lang="scss" >
@import '../scss/variables.scss';

.dashboard-page {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background-color: #fff;

    .dashboard-page-sidebar {
        position: relative;
        float: left;
        width: 270px;
        height: 100%;
        background: darken(theme-color("primary"), 10%);
        background-color: #fff;
        background-color: theme-color("primary");
        z-index: 100;
        box-shadow: 0 0.46875rem 2.1875rem rgba(0, 0, 0, 0.03), 0 0.9375rem 1.40625rem rgba(0, 0, 0, 0.03), 0 0.25rem 0.53125rem rgba(0, 0, 0, 0.05), 0 0.125rem 0.1875rem rgba(0, 0, 0, 0.03);

        .dashboard-page-sidebar-header {
            position: relative;
            display:block;
            width: 100%;
            height: 66px;
            padding: 0px 24px;
            border-bottom: 1px solid lighten(theme-color("primary"), 5%);

            i {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                line-height: 48px;
                text-align: center;
                background-color: theme-color("white");
                color: theme-color("primary");
                font-size: 20px;
            }

        }

        .dashboard-page-sidebar-list {
            position: relative;
            display:block;
            width: 100%;
            height: calc(100% - 66px);
            padding: 15px 0px;
            border-radius: 0px;
            border: none;
            background-color: transparent;

            .list-group-item {
                position: relative;
                display: block;
                width: calc(100% - 30px);
                margin: 8px 15px;
                text-align: left;
                font-size: 16px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 60ms, color 60ms;
                background-color: transparent;
                border: none;
                padding: 0px!important;

                a, button {
                    position: relative;
                    display: block;
                    width: 100%;
                    color: darken(theme-color("white"), 10%);
                    text-decoration: none;
                    background-color: transparent;
                    transition: background-color 200ms, color 200ms;
                    font-size: 1.0rem;
                    font-weight: 400;
                    border-radius: 8px;
                    padding: 15px 18px!important;
					text-align: left!important;

                    i {
                        font-size: 18px;
                    }

                    &:hover {
                        background-color: lighten(theme-color("primary"), 5%);
                        color: theme-color("white");
                    }

                    &.router-link-active {
                        background-color: lighten(theme-color("primary"), 5%);
                        color: theme-color("white");
                    }
                }
            }
        }
    }

    .dashboard-page-title-bar {
        position: relative;
        float: left;
        width: calc(100% - 270px);
        height: 66px;
        z-index: 10;
        background-color: #F8F8FA;
        background-color: #fff;
        box-shadow: 0 0.46875rem 2.1875rem rgba(0, 0, 0, 0.03), 0 0.9375rem 1.40625rem rgba(0, 0, 0, 0.03), 0 0.25rem 0.53125rem rgba(0, 0, 0, 0.05), 0 0.125rem 0.1875rem rgba(0, 0, 0, 0.03);
        z-index: 100;

        .breadcrumb {
            background-color: transparent;

            .breadcrumb-item {

                a {
                    color: theme-color("primary");

                }

                &::before {
                    content: ">";
                }

                &:nth-child(1) {
                    &::before {
                        display: none!important;
                    }
                }

            }
        }
    }

    .dashboard-page-content {
        position: relative;
        float: left;
        width: calc(100% - 270px);
        height: calc(100% - 66px);
        background-color: darken(theme-color("white"), 5%);
        background-color: #fff;
        background-color: #F8F8FA;

        .router-view {
            position: relative;
            display: block; 
            width: 100%;
            height: 100%;

            &.zoom-fade-enter-active {
                transition: opacity 200ms linear, transform 200ms cubic-bezier(.2,.5,.1,1);
            }

            &.zoom-fade-leave-active {
                transition: opacity 200ms linear, transform 200ms cubic-bezier(.5,0,.7,.4);
            }

            &.zoom-fade-enter {
                transform-origin: 50% 50%;
                transform: translateY(6px);
                opacity: 0;
            }

            &.zoom-fade-leave-to {
                transform-origin: 50% 50%;
                transform: translateY(6px);
                opacity: 0;
            }

        }
    }


}
</style>