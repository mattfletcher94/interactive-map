import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import DashboardPageMapsPage from '../views/DashboardPageMapsPage.vue'
import DashboardPageCreateMapPage from '../views/DashboardPageCreateMapPage.vue'
import DashboardPageAccountPage from '../views/DashboardPageAccountPage.vue'
import DashboardPageHelpPage from '../views/DashboardPageHelpPage.vue'
import DashboardPageEditMapPage from '../views/DashboardPageEditMapPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/login/',
        alias: '/',
        name: 'Login',
        component: LoginPage,
        meta: {
            title: 'Interactive Map - Login',
        }
    },
    {
        path: '/dashboard/maps/edit/:id',
        component: DashboardPageEditMapPage,
        meta: {
            title: 'Interactive Map - Editor',
            requiresAuth: true,
            breadcrumbs: []
        },
    },
    {
        path: '/dashboard/',
        component: DashboardPage,
        meta: {
            title: 'Interactive Map - Dashboard',
            requiresAuth: true,
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: true,
                    exact: true,
                    to: '/dashboard/'
                }
            ],
        },
        children: [
            {
                path: 'maps',
                component: DashboardPageMapsPage,
                name: 'Dashboard > My Maps',
                meta: {
                    title: 'Interactive Map - My Maps',
                    requiresAuth: true,
                    breadcrumbs: [
                        {
                            text: 'Dashboard',
                            link: true,
                            exact: true,
                            to: '/dashboard/'
                        },
                        {
                            text: 'My Maps',
                            link: true,
                            exact: true,
                            to: '/dashboard/maps/'
                        }
                    ]
                }
            },
            {
                path: 'account',
                component: DashboardPageAccountPage,
                name: 'Dashboard > Account',
                meta: {
                    title: 'Interactive Map - My Account',
                    requiresAuth: true,
                    breadcrumbs: [
                        {
                            text: 'Dashboard',
                            link: true,
                            exact: true,
                            to: '/dashboard/'
                        },
                        {
                            text: 'Account',
                            link: true,
                            exact: true,
                            to: '/dashboard/account/'
                        }
                    ]
                }
            },
            {
                path: 'help',
                component: DashboardPageHelpPage,
                name: 'Dashboard > Help',
                meta: {
                    title: 'Interactive Map - Help',
                    requiresAuth: true,
                    breadcrumbs: [
                        {
                            text: 'Dashboard',
                            link: true,
                            exact: true,
                            to: '/dashboard/'
                        },
                        {
                            text: 'Help',
                            link: true,
                            exact: true,
                            to: '/dashboard/help/'
                        }
                    ]
                }
            },
            {
                path: 'maps/create',
                component: DashboardPageCreateMapPage,
                name: 'Dashboard > My Maps -> Create',
                meta: {
                    title: 'Interactive Map - Create Map',
                    requiresAuth: true,
                    breadcrumbs: [
                        {
                            text: 'Dashboard',
                            link: true,
                            exact: true,
                            to: '/dashboard/'
                        },
                        {
                            text: 'My Maps',
                            link: true,
                            exact: true,
                            to: '/dashboard/maps/'
                        },
                        {
                            text: 'Create Map',
                            link: true,
                            exact: true,
                            to: '/dashboard/maps/create'
                        }
                    ]
                }
            },
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});


router.beforeEach((to, from, next) => {

    // Set document title
    document.title = to.meta.title;
	
	// Get current JWT from local storage
	const jwt = window.localStorage.getItem('JWT')

	// If at login screen but already logged in,
	// redirect to the projects page
	if (jwt && to.name === 'Login') {
		return next('/dashboard/maps/')
	}

	// If the router required auth, check to make sure
	// user is actually logged in before sending them there,
	// else send them back to login page.
	if (!jwt && to.meta.requiresAuth) {
		return next('/login/')
	}

	next()
})

export default router
