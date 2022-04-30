<template>
<div
    class="edit-map-page"
    :class="mapMarkerAdding ? `map-marker-cursor` : ``"
    tabindex="0"
    v-on:mouseup.left="handleCreateMapMarkerMouseup">

    <!-- Loader -->
    <overlay-loader
        message="Loading Map..."
        :show.sync="mapRendererLoading"
        :opacity="1" />

    <!-- Tool Panel -->
    <div
        class="right-panel">

        <!-- Parent menu -->
        <div
            class="right-panel-parent-menu">
            <router-link
                class="right-panel-parent-menu-title"
                v-b-tooltip.hover="{ title: 'Back to dashboard', placement: 'right', boundary: 'viewport', delay: { show: 1000, hide: 0  } }"
                to="/dashboard/maps">
                <i class="fas fa-map-marked-alt"></i>
            </router-link>
            <div
                class="right-panel-parent-menu-items">
                <div
                    class="right-panel-parent-menu-items-item"
                    :class="menuItem.active ? `active` : ``"
                    v-for="menuItem in menuItems"
                    v-bind:key="menuItem.name"
                    v-on:click="setMenuItemActive(menuItem)"
                    v-b-tooltip.hover="{ title: menuItem.name, placement: 'right', boundary: 'viewport', delay: { show: 1000, hide: 0  } }">
                    <i :class="`fas ${menuItem.icon}`"></i>
                </div>
            </div>
        </div>

        <!-- Content for menu items -->
        <div
            class="right-panel-parent-menu-content">

            <!-- Map info -->
            <transition
                name="right-panel-parent-menu-content-inner"
                mode="out-in">
                <div
                    class="right-panel-parent-menu-content-inner map-info p-3"
                    v-show="activeMenuItemName == 'Info'">
                    <div
                        class="row no-gutters mt-2">
                        <div
                            class="col-12">
                            <h5
                                class="m-0">Map Info</h5>
                            <hr
                                class="mb-0" />
                        </div>
                    </div>
                    <div
                        class="row no-gutters mt-3">
                        <div
                            class="col-12">
                            <form-edit-map 
                                v-if="this.map"
                                v-bind:map="this.map"
                                v-bind:busy="editMapFormBusy"
                                v-bind:invalid-feedback="editMapFormInvalidFeedback"
                                v-on:success="onEditMapFormSuccess" 
                            />
                        </div>
                    </div>
                    <div
                        class="row no-gutters mt-3">
                        <div
                            class="col-12">
                            <hr
                                class="m-0" />
                        </div>
                    </div>
                    <div
                        class="row no-gutters mt-3"
                        v-if="this.map && this.map.mapPitchedBookingEnabled && this.map.mapPitchedBookingURL">
                        <div
                            class="col-12"
                            v-if="!pitchedBookingUnitsRequestRunning">
                            <b-alert
                                v-if="!pitchedBookingUnitsError"
                                show
                                variant="info">
                                <p
                                    class="m-0">We have successfully received {{ pitchedBookingUnits.length }} units from your Pitched Booking account.</p>
                            </b-alert>
                            <b-alert
                                v-else
                                show
                                variant="danger">
                                <p
                                    class="m-0">There was an error retrieving units from your Pitched Booking account.</p>
                            </b-alert>
                        </div>
                        <div
                            class="col-12"
                            v-else>
                            <p>Loading Pitched Units...</p>
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Keys -->
            <transition
                name="right-panel-parent-menu-content-inner"
                mode="out-in">
                <div
                    class="right-panel-parent-menu-content-inner keys p-3"
                    v-show="activeMenuItemName == 'Key'">
                    <div
                        class="row no-gutters mt-2">
                        <div
                            class="col-12">
                            <h5
                                class="m-0">Keys</h5>
                            <hr
                                class="mb-0" />
                        </div>
                    </div>
                    <div
                        class="row no-gutters mt-3">
                        <b-list-group
                            class="map-keys-btn-group w-100"
                            horizontal>
                            <b-list-group-item
                                class="flex-fill text-center"
                                href="#"
                                :disabled="mapKeysSaveAllRunning"
                                v-on:click.prevent.stop="mapKeysSaveAll"
                                v-b-tooltip.hover="{ title: 'Save all', placement: 'top', boundary: 'viewport' }">
                                <i class="fas fa-save" style="pointer-events: none"></i>
                            </b-list-group-item>
                            <b-list-group-item
                                class="flex-fill text-center"
                                href="#"
                                v-on:click="mapKeyCreate"
                                v-b-tooltip.hover="{ title: 'Add a new key item', placement: 'top', boundary: 'viewport' }">
                                <i class="fas fa-plus" style="pointer-events: none"></i>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                    <div
                        class="row no-gutters mt-3">
                        <div
                            class="map-keys-list">
                            <map-key-item
                                v-for="mapKey in mapKeys"
                                v-bind:key="mapKey.mapKeyId"
                                v-bind:map-key="mapKey"
                                v-on:map-key-change="mapKeyChange"
                                v-on:map-key-save="mapKeySave"
                                v-on:map-key-delete="mapKeyDelete" />
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Markers -->
            <transition
                name="right-panel-parent-menu-content-inner"
                mode="out-in">
                <div
                    class="right-panel-parent-menu-content-inner markers p-3"
                    ref="markersContent"
                    v-show="activeMenuItemName == 'Markers'">
                    <div
                        class="row no-gutters mt-2">
                        <div
                            class="col-12">
                            <h5
                                class="m-0">Markers</h5>
                            <hr
                                class="mb-0" />
                        </div>
                    </div>
                    <div
                        class="row no-gutters mt-3">
                        <b-list-group
                            class="map-markers-btn-group w-100"
                            horizontal>
                            <b-list-group-item
                                class="flex-fill text-center"
                                href="#"
                                :disabled="mapMarkersSaveAllRunning"
                                v-on:click.prevent.stop="mapMarkersSaveAll">
                                <i class="fas fa-save" v-if="!mapMarkersSaveAllRunning" v-b-tooltip.hover="{ title: 'Save all map markers', placement: 'top', boundary: 'viewport' }"></i>
                                <i class="fas fa-circle-notch fa-spin" v-else></i>
                            </b-list-group-item>
                            <b-list-group-item
                                v-if="mapMarkerAdding ? false : true"
                                class="flex-fill text-center"
                                href="#"
                                v-on:mousedown.prevent.stop="handleCreateMapMarkerMousedown"
                                v-b-tooltip.hover="{ title: 'Drag me onto the map to add a new marker', placement: 'top', boundary: 'viewport' }">
                                <i class="fas fa-plus"></i>
                            </b-list-group-item>
                            <b-list-group-item
                                v-else
                                class="flex-fill text-center"
                                href="#"
                                :disabled="true">
                                <i class="fas fa-plus"></i>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                    <div
                        class="row no-gutters mt-3">
                        <div
                            class="map-markers-list">
                            <draggable
                                v-model="mapMarkers"
                                v-on:end="mapMarkersReorder"
                                ghost-class="map-marker-item-ghost"
                                animation="200"
                                handle=".map-marker-item-handle">
                                <map-marker-item
                                    v-for="mapMarker in computedMapMarkersFiltered"
                                    v-bind:key="mapMarker.mapMarkerId"
                                    v-bind:marker="mapMarker"
                                    v-bind:keys="computedMapKeysNotTemporary"
                                    v-bind:pitched-enabled="map.mapPitchedBookingEnabled && map.mapPitchedBookingURL && !map.pitchedBookingUnitsError ? true : false"
                                    v-bind:pitched-units="pitchedBookingUnits"
                                    v-on:marker-select="mapMarkerSelect"
                                    v-on:marker-locked="mapMarkerLocked"
                                    v-on:marker-change="mapMarkerChange"
                                    v-on:marker-save="mapMarkerSave"
                                    v-on:marker-delete="mapMarkerDelete" />
                            </draggable>
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Settings -->
            <transition
                name="right-panel-parent-menu-content-inner"
                mode="out-in">
                <div
                    class="right-panel-parent-menu-content-inner settings p-3"
                    v-show="activeMenuItemName == 'Settings'">
                    <div
                        class="row no-gutters mt-2">
                        <div
                            class="col-12">
                            <h5
                                class="m-0">Settings</h5>
                            <hr
                                class="mb-0" />
                        </div>
                    </div>
                    <div
                        class="row no-gutters mt-3">
                        <div
                            class="col-12">
                            <b-form-group
                                class="m-0"
                                label="Delete your Map. This cannot be undone."
                                label-size="sm">
                                <b-button
                                    class="mt-2 btn-flat btn-flat-danger"
                                    size="sm"
                                    @click="deleteMapModalOpen = true">Delete Map</b-button>
                            </b-form-group>
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Embed -->
            <transition
                name="right-panel-parent-menu-content-inner"
                mode="out-in">
                <div
                    class="right-panel-parent-menu-content-inner settings p-3"
                    v-show="activeMenuItemName == 'Embed'">
                    <div
                        class="row no-gutters mt-2">
                        <div
                            class="col-12">
                            <h5
                                class="m-0">Embed</h5>
                            <hr
                                class="mb-0" />
                        </div>
                    </div>
                    <div
                        class="row  mt-3">
                        <div class="col-12">
                            <b-form-group
                                class="m-0 w-100"
                                disabled
                                label="Paste this code on your website:"
                                label-size="sm">
                                <p
                                    class="mt-2"
                                    style="word-wrap:break-word;font-size:13px;padding:12px;border:1px solid #e1e1e1;background-color:#f8f8f8">
                                    {{ this.iframeCode }}
                                </p>
                            </b-form-group>
                        </div>
                        <div class="col-6 mt-2 pr-1">
                            <b-button
                                class="btn-flat btn-flat-primary"
                                v-on:click="copyIframeEmbedToClipboard"
                                ref="copyToClipboardButton"
                                size="sm"
                                block>
                                {{ copyEmbedBtnText }}
                            </b-button>
                        </div>
                        <div class="col-6 mt-2 pl-1">
                            <b-button
                                class="btn-flat btn-flat-primary"
                                :href="iframePreviewURL"
                                target="_blank"
                                ref="copyToClipboardButton"
                                size="sm"
                                block>
                                View Preview
                            </b-button>
                        </div>
                    </div>
                </div>
            </transition>

        </div>
    </div>

    <!-- Canvas -->
    <div
        class="left-panel">
        <map-renderer
            :key="this.mapCanvasRerender"
            v-if="this.mapContentLoaded && this.map.mapImage.imageId"
            v-bind:map="this.map"
            v-bind:markers="this.computedMapMarkersFiltered"
            v-bind:keys="this.mapKeys"
            v-on:ready="mapRendererLoading = false"
            v-on:marker-select="mapMarkerSelect"
            v-on:marker-hover="mapMarkerHover"
            v-on:marker-unhover="mapMarkerUnhover"
            v-on:mouseup="handleCreateMapMarkerMouseup" />
        <div
            class="marker-drop-zone">
            <div
                class="marker-drop-zone-helper-text">
                <h6
                    class="mb-1">Drop on map</h6>
                <p
                    class="m-0 text-light">Press ESC key to cancel</p>
            </div>
        </div>
    </div>

    <!-- Delete map confirm modal -->
    <confirm-modal
        :open.sync="deleteMapModalOpen"
        :loading.sync="deleteMapModalBusy"
        :width="420"
        title="Please Confirm"
        message="Please confirm that you wish to delete this map. This action cannot be undone."
        confirm="Yes, delete this map"
        confirm-variant="danger"
        cancel="Cancel"
        v-on:confirm="deleteMap"
        v-on:cancel="deleteMapModalOpen = false">
    </confirm-modal>

</div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import RepositoryFactory from '@/repositories/RepositoryFactory';
import MapClient from '@/models/MapModels/Map.client';
import MapMarkerClient from '@/models/MapMarkerModels/MapMarker.client';
import MapMarkerEditor from '@/models/MapMarkerModels/MapMarker.editor';
import MapKeyClient from '@/models/MapKeyModels/MapKey.client';
import MapKeyEditor from '@/models/MapKeyModels/MapKey.editor';
import uuidv4 from '@/helpers/uuid'
import PitchedUnitClient from '@/models/PitchedUnitModels/PitchedUnit.client';
import debounce from 'lodash.debounce';
import MapUpdate from '@/models/MapModels/Map.update';

@Component({
    beforeRouteLeave(to : any, from : any, next : any) {
        // @ts-ignore
        var markers = this.mapMarkers 
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].mapMarkerDirty) {
                const answer = window.confirm('Do you really want to leave? You have unsaved map markers.')
                if (answer) {
                    next()
                } else {
                    next(false);
                }
                return;
            }
        }
        // @ts-ignore
        var mapKeys = this.mapKeys 
        for (var i = 0; i < mapKeys.length; i++) {
            if (mapKeys[i].mapKeyDirty) {
                const answer = window.confirm('Do you really want to leave? You have unsaved keys.')
                if (answer) {
                    next()
                } else {
                    next(false);
                }
                return;
            }
        }
        next();
    }
})
export default class DashboardPageEditMapPage extends Vue {

    /**
     * Menu items
     */
    public menuItems = [
        { name: "Info", icon: "fa-file-alt", active: true },
        { name: "Key", icon: "fa-key", active: false },
        { name: "Markers", icon: "fa-map-marker-alt", active: false },
        { name: "Settings", icon: "fa-cog", active: false },
        { name: "Embed", icon: "fa-code", active: false },
    ]

    /**
     * Current map being viewed
     */
    public map: MapClient | null = null;

    /**
     * If is saving pitched booking settings
     */
    public mapPitchedBookingSaving = false;

    /**
     * Current map keys for this map
     */
    public mapKeys: Array < MapKeyEditor > = [];

    /**
     * Current map markers for this map
     */
    public mapMarkers: Array < MapMarkerEditor > = [];

    /**
     * Pitched booking units
     */
    public pitchedBookingUnits: Array < PitchedUnitClient > = [];

    /**
     * Pitched booking units
     */
    public pitchedBookingUnitsRequestRunning = false;

    /**
     * If there was an error with the Pitched Booking API call
     */
    public pitchedBookingUnitsError = false;

    /**
     * If saving all map markers
     */
    public mapMarkersSaveAllRunning = false;

    /**
     * If saving all map keys
     */
    public mapKeysSaveAllRunning = false;

    /**
     * Selected map keys filter
     */
    public mapKeysSelectedFilter = "";

    /** 
     * If the map is currently loading
     */
    public mapLoading = false;

    /**
     * Map content loaded
     */
    public mapContentLoaded = false;

    /**
     * Map renderer finished loading
     */
    public mapRendererLoading = true;

    /**
     * If the user is currently dragging a map marker
     */
    public mapMarkerAdding = false;

    /**
     * Is the delete modal open?
     */
    public deleteMapModalOpen = false;

    /**
     * Is the delete modal busy?
     */
    public deleteMapModalBusy = false;

    /**
     * Increment this to rerender the map renderer
     */
    public mapCanvasRerender = 0;

    /**
     * iframe embed code
     */
    public iframeCode = "";
    public iframePreviewURL = "";
	public copyEmbedBtnText = "Copy";

    public editMapFormBusy = false;
    public editMapFormInvalidFeedback = "";

    /**
     * Lifecycle hook: Created
     */
    public created() {
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener('resize', debounce(this.handleWindowResize, 300));
    }

    /**
     * Lifecycle hook: Mounted
     */
    public async mounted() {

        // is now loading
        this.mapContentLoaded = false;

        // Get the map
        this.map = await this.getMap();

        // If map wasn't found, return to dashboard.
        if (this.map == null) {
            alert("Sorry, this map doesn't exist.");
            this.$router.push('/dashboard/maps/');
            return;
        }

        // Set document title
        document.title = 'Interactive Map - ' + this.map.mapTitle;

        // Get keys
        this.mapKeys = await this.getMapKeys();

        // Get markers
        this.mapMarkers = await this.getMapMarkers();

        // Get pitched units
        this.pitchedBookingUnits = await this.getPitchedBookingUnits();

        // Set iframe URL
        this.iframePreviewURL = process.env.VUE_APP_EMBED_BASE_URL + '/' + this.$route.params.id;
        this.iframeCode = `<iframe 
            style="border:1px solid #e1e1e1" 
            width="100%" 
            height="490px" 
            src="${process.env.VUE_APP_EMBED_BASE_URL + '/' + this.$route.params.id}" 
            allowfullscreen>
        </iframe>`;

		// Set active menu item based on local storage
		var activeMenuItem = window.localStorage.getItem('active-menu-item');
		if (activeMenuItem) {
			this.menuItems.forEach((mi) => {
				if (mi.name === activeMenuItem)
					mi.active = true;
				else
					mi.active = false;
			});
		}

        // Content has now been loaded
        this.mapContentLoaded = true;

    }

    /**
     * Lifecycle hook: Destroyed
     */
    public destroyed() {
        window.removeEventListener("keyup", this.handleKeyUp);
    }


    /**
     * Get the currently viewed map
     */
    private async getMap(): Promise < MapClient | null > {
        const response = await new RepositoryFactory().getMapsRepository().getOne(this.$route.params.id);
        if (response.is200) {
            return new MapClient({
                ...response.is200.data,
                mapImage: response.is200.data.mapImage ? response.is200.data.mapImage : undefined,
            });
        }
        return null;
    }

    /**
     * Save changes to map
     */
    public async onEditMapFormSuccess(data: MapUpdate) {

        this.editMapFormBusy = true;

        // Do API stuff
        const repo = new RepositoryFactory().getMapsRepository();
        const resp = await repo.update(this.$route.params.id, {
            mapTitle: data.mapTitle,
            mapDescription: data.mapDescription,
            mapImage: data.mapImage,
            mapPitchedBookingEnabled: data.mapPitchedBookingEnabled,
            mapPitchedBookingURL: data.mapPitchedBookingURL
        });

        // If there was a validation error
        if (resp.is400) {
            this.editMapFormInvalidFeedback = resp.is400.errors[0].message;
        }

        // Else if 404 the map doesn't exist
        else if (resp.is404) {
            this.editMapFormInvalidFeedback = resp.is404.message;
        }

        // Else if all was good
        else if (resp.is200) {
            const oldURL = this.map?.mapPitchedBookingURL;
            document.title = 'Interactive Map - ' + this.map?.mapTitle;
            if (data.mapPitchedBookingEnabled && oldURL != data.mapPitchedBookingURL) {
                this.pitchedBookingUnits = await this.getPitchedBookingUnits();
            }
            this.editMapFormInvalidFeedback = "";
            this.map = new MapClient({ 
                mapId: resp.is200.data.mapId,
                mapUser: resp.is200.data.mapUser,
                mapTitle: resp.is200.data.mapTitle,
                mapDescription: resp.is200.data.mapDescription,
                mapImage: resp.is200.data.mapImage ? resp.is200.data.mapImage : undefined,
                mapPitchedBookingEnabled: resp.is200.data.mapPitchedBookingEnabled,
                mapPitchedBookingURL: resp.is200.data.mapPitchedBookingURL,
            });
            await this.$nextTick();
            this.mapCanvasRerender++;
        }

        // Request is no longer running
        this.editMapFormBusy = false;

    }

    /**
     * Delete a map
     */
    public async deleteMap() {
        this.deleteMapModalBusy = true;
        await new RepositoryFactory().getMapsRepository().delete(this.$route.params.id);
        this.$router.push('/dashboard/maps/');
    }

    /**
     * Get pitched booking units
     */
    public async getPitchedBookingUnits() {
        if (this.map && this.map.mapPitchedBookingEnabled && this.map.mapPitchedBookingURL.length > 0) {
            this.pitchedBookingUnitsRequestRunning = true;
            const response = await new RepositoryFactory().getPitchedUnitsRepository(this.map.mapPitchedBookingURL + 'units').get();
            if (response.is200) {
                this.pitchedBookingUnitsRequestRunning = false;
                this.pitchedBookingUnitsError = false;
                return response.is200.data;
            } else {
                this.pitchedBookingUnitsRequestRunning = false;
                this.pitchedBookingUnitsError = true;
            }
        }
        return [];
    }

    /**
     * Get keys for current viewerd map
     */
    private async getMapKeys(): Promise < Array < MapKeyEditor >> {
        const response = await new RepositoryFactory().getMapKeysRepository(this.$route.params.id).get();
        if (response.is200) {
            return response.is200.data.map((m: MapKeyClient) => {
                const k = new MapKeyEditor({
                    ...m,
                    mapKeyTemporary: false,
                    mapKeyDirty: false,
                    mapKeyBusy: false,
                });
                return k;
            });
        }
        return [];
    }

    /**
     * Get map markers for this map
     */
    private async getMapMarkers(): Promise < Array < MapMarkerEditor >> {
        const response = await new RepositoryFactory().getMapMarkersRepository(this.$route.params.id).get();
        if (response.is200) {
            return response.is200.data.map((m: MapMarkerClient) => {
                const marker = new MapMarkerEditor({
                    ...m,
                    mapMarkerSelected: false,
                    mapMarkerDirty: false,
                    mapMarkerTemporary: false,
                });
                return marker;
            }).sort((a, b) => (a.mapMarkerOrder > b.mapMarkerOrder) ? 1 : -1);
        }
        return [];
    }

    /**
     * Get a map marker by id
     */
    private getMapMarkerById(mapMarkerId: string) {
        for (let i = 0; i < this.mapMarkers.length; i++) {
            if (this.mapMarkers[i].mapMarkerId === mapMarkerId) {
                return this.mapMarkers[i];
            }
        }
        return null;
    }

    /**
     * Get a map marker by id
     */
    private getMapKeyById(mapKeyId: string) {
        for (let i = 0; i < this.mapKeys.length; i++) {
            if (this.mapKeys[i].mapKeyId === mapKeyId) {
                return this.mapKeys[i];
            }
        }
        return null;
    }

    /**
     * Select a map marker
     */
    public mapMarkerSelect(markerId: string) {
        this.mapMarkers.forEach((m) => {
            m.mapMarkerSelected = m.mapMarkerId === markerId;
        });
    }

    /**
     * Hover over a map marker
     */
    public mapMarkerHover(markerId: string) {
        this.mapMarkers.forEach((m) => {
            m.mapMarkerHovered = m.mapMarkerId === markerId;
        });
    }

    /**
     * Unhover over a map marker
     */
    public mapMarkerUnhover(markerId: string) {
        const marker = this.getMapMarkerById(markerId);
        if (marker) {
            marker.mapMarkerHovered = false;
        }
    }

    /**
     * Lock a map marker
     */
    public mapMarkerLocked(markerId: string, isLocked: boolean) {
        const marker = this.getMapMarkerById(markerId);
        if (marker) {
            marker.mapMarkerLocked = isLocked;
        }
    }

    /**
     * Save a map marker.
     * If the map marker is temproary then make 
     * a request to create one, else just 
     * update the current marker.
     */
    public async mapMarkerSave(markerId: string) {
        const marker = this.getMapMarkerById(markerId);
        if (marker) {
            marker.mapMarkerBusy = true;
            marker.mapMarkerError = "";
            if (marker.mapMarkerTemporary) {
                const resp = await new RepositoryFactory().getMapMarkersRepository(this.$route.params.id).create(marker.toCreate());
                if (resp.is201) {

                    // Delete temp marker
                    const index = this.mapMarkers.indexOf(marker);
                    if (index !== -1) {
                        this.mapMarkers.splice(index, 1);
                    }

                    // Add a real one
                    this.mapMarkers.splice(index, 0, new MapMarkerEditor({
                        ...resp.is201.data,
                        mapMarkerSelected: false,
                        mapMarkerDirty: false,
                        mapMarkerTemporary: false,
                        mapMarkerBusy: false
                    }));

                } else if (resp.is400) {
                    marker.mapMarkerError = resp.is400.errors[0].message;
                } else {
                    marker.mapMarkerError = "An unknown error occured. please try again later."
                }
                marker.mapMarkerBusy = false;
            } else {
                const resp = await new RepositoryFactory().getMapMarkersRepository(this.$route.params.id).update(marker.mapMarkerId, marker.toUpdate());
                if (resp.is200) {
                    marker.mapMarkerDirty = false;
                } else if (resp.is400) {
                    marker.mapMarkerError = resp.is400.errors[0].message;
                } else if (resp.is404) {
                    marker.mapMarkerError = resp.is404.message;
                } else {
                    marker.mapMarkerError = "An unknown error occured. please try again later."
                }
                marker.mapMarkerBusy = false;
            }
        }
    }

    /**
     * Delete a map marker.
     * if the map marker is not temporary then also delete from database.
     */
    public async mapMarkerDelete(markerId: string) {
        const marker = this.getMapMarkerById(markerId);
        if (marker) {
            if (!marker.mapMarkerTemporary) {
                marker.mapMarkerBusy = true;
                await new RepositoryFactory().getMapMarkersRepository(this.$route.params.id).delete(marker.mapMarkerId);
            }
            const index = this.mapMarkers.indexOf(marker);
            if (index !== -1) {
                this.mapMarkers.splice(index, 1);
            }
        }
    }

    /**
     * Handle a field change event for map marker
     */
    public mapMarkerChange(markerClone: MapMarkerEditor) {
        const marker = this.getMapMarkerById(markerClone.mapMarkerId);
        if (marker) {
            marker.mapMarkerName = markerClone.mapMarkerName;
            marker.mapMarkerKey = markerClone.mapMarkerKey;
            marker.mapMarkerPositionX = markerClone.mapMarkerPositionX;
            marker.mapMarkerPositionY = markerClone.mapMarkerPositionY;
            marker.mapMarkerLocked = markerClone.mapMarkerLocked;
            marker.mapMarkerTitle = markerClone.mapMarkerTitle;
            marker.mapMarkerTitleDisplayType = markerClone.mapMarkerTitleDisplayType;
            marker.mapMarkerDescription = markerClone.mapMarkerDescription;
            marker.mapMarkerPitchedUnitSelection = markerClone.mapMarkerPitchedUnitSelection;
            marker.mapMarkerButtonEnabled = markerClone.mapMarkerButtonEnabled;
            marker.mapMarkerButtonLabel = markerClone.mapMarkerButtonLabel;
            marker.mapMarkerButtonURL = markerClone.mapMarkerButtonURL;
            marker.mapMarkerImagesEnabled = markerClone.mapMarkerImagesEnabled;
            marker.mapMarkerImages = markerClone.mapMarkerImages;
            marker.mapMarkerOrder = markerClone.mapMarkerOrder;
            marker.mapMarkerDirty = true;
        }
    }

    /**
     * Get selected map marker
     */
    public mapMarkerGetSelected() {
        for (let i = 0; i < this.mapMarkers.length; i++) {
            if (this.mapMarkers[i].mapMarkerSelected) {
                return this.mapMarkers[i];
            }
        }
        return null;
    }

    /**
     * Save all map markers
     */
    public async mapMarkersSaveAll() {
        this.mapMarkersSaveAllRunning = true;
        for (const m of this.mapMarkers) {
            if (m.mapMarkerDirty && !m.mapMarkerBusy) {
                await this.mapMarkerSave(m.mapMarkerId);
            }
        }
        this.mapMarkersSaveAllRunning = false;
    }

    /**
     * When user has finished updating map marker
     */
    public mapMarkersReorder() {
        for (let i = 0; i < this.mapMarkers.length; i++) {
            if (this.mapMarkers[i].mapMarkerOrder !== i) {
                this.mapMarkers[i].mapMarkerDirty = true;
                this.mapMarkers[i].mapMarkerOrder = i;
            }
        }
    }

    /**
     * Create a new temporary map key
     */
    public mapKeyCreate() {
        this.mapKeys.unshift(new MapKeyEditor({
            mapKeyId: uuidv4(),
            mapKeyMap: this.map?.mapId,
            mapKeyTemporary: true,
            mapKeyDirty: true,
            mapKeyColor: 'dc3545'
        }));
    }

    /**
     * Create or update a map key depending on its state
     */
    public async mapKeySave(mapKeyId: string) {
        const item = this.getMapKeyById(mapKeyId);
        if (item) {
            item.mapKeyBusy = true;
            item.mapKeyError = "";
            if (item.mapKeyTemporary) {
                const resp = await new RepositoryFactory().getMapKeysRepository(this.$route.params.id).create(item.toCreate());
                if (resp.is201) {
                    item.mapKeyDirty = false;
                    item.mapKeyTemporary = false;
                    item.mapKeyId = resp.is201.data.mapKeyId;
                } else if (resp.is400) {
                    item.mapKeyError = resp.is400.errors[0].message;
                } else {
                    item.mapKeyError = "An unknown error occured. please try again later."
                }
                item.mapKeyBusy = false;
            } else {
                const resp = await new RepositoryFactory().getMapKeysRepository(this.$route.params.id).update(item.mapKeyId, item.toUpdate());
                if (resp.is200) {
                    item.mapKeyDirty = false;
                } else if (resp.is400) {
                    item.mapKeyError = resp.is400.errors[0].message;
                } else if (resp.is404) {
                    item.mapKeyError = resp.is404.message;
                } else {
                    item.mapKeyError = "An unknown error occured. please try again later."
                }
                item.mapKeyBusy = false;
            }
        }
    }

    /**
     * Listen to the map key on change event
     */
    public async mapKeyChange(mapKeyClone: MapKeyEditor) {
        const item = this.getMapKeyById(mapKeyClone.mapKeyId);
        if (item) {
            item.mapKeyDirty = true;
            item.mapKeyColor = mapKeyClone.mapKeyColor;
            item.mapKeyTitle = mapKeyClone.mapKeyTitle;
        }
    }

    /**
     * Listen to the map key on delete event
     */
    public async mapKeyDelete(mapKeyId: string) {
        const item = this.getMapKeyById(mapKeyId);
        if (item) {

            // Delete from DB
            if (!item.mapKeyTemporary) {
                item.mapKeyBusy = true;
                await new RepositoryFactory().getMapKeysRepository(this.$route.params.id).delete(item.mapKeyId);
            }

            // Set each map marker who uses this key
            // to use no key
            for (let i = 0; i < this.mapMarkers.length; i++) {
                if (this.mapMarkers[i].mapMarkerKey == item.mapKeyId) {
                    this.mapMarkers[i].mapMarkerDirty = true;
                    this.mapMarkers[i].mapMarkerKey = "";
                }
            }

            // Remove from array
            const index = this.mapKeys.indexOf(item);
            if (index !== -1) {
                this.mapKeys.splice(index, 1);
            }

        }
    }

    /**
     * Save all map keys
     */
    public async mapKeysSaveAll() {
        this.mapKeysSaveAllRunning = true;
        for (const m of this.mapKeys) {
            if (m.mapKeyDirty && !m.mapKeyBusy) {
                await this.mapKeySave(m.mapKeyId);
            }
        }
        this.mapKeysSaveAllRunning = false;
    }

    /**
     * Begin adding a new map marker by pressing mouse down
     * on the add map marker button
     */
    public handleCreateMapMarkerMousedown(e: Event) {
        if (!this.mapMarkerAdding) {
            this.mapMarkerAdding = true;
        }
    }

    /**
     * User has now let go of mouse button,
     * so place the marker on the map
     */
    public handleCreateMapMarkerMouseup(position: { x: number;y: number }) {
        if (this.mapMarkerAdding) {
            this.mapMarkerAdding = false;
            this.mapMarkers.unshift(new MapMarkerEditor({
                mapMarkerId: uuidv4(),
                mapMarkerMap: this.map?.mapId,
                mapMarkerUser: this.map?.mapUser,
                mapMarkerOrder: (this.mapMarkers[0] ? (this.mapMarkers[0].mapMarkerOrder - 1) : 0),
                mapMarkerName: "",
                mapMarkerPositionX: position.x,
                mapMarkerPositionY: position.y,
                mapMarkerTitle: "",
                mapMarkerTitleDisplayType: 'never',
                mapMarkerSelected: false,
                mapMarkerLocked: false,
                mapMarkerDirty: true,
                mapMarkerTemporary: true,
            }));

        }
    }

    /**
     * Cancel map marker with escape key
     */
    public handleCreateMapMarkerCancel() {
        if (this.mapMarkerAdding) {
            this.mapMarkerAdding = false;
        }
    }

    /**
     * Handle key events
     */
    public handleKeyUp(e: KeyboardEvent) {
        e.preventDefault();
        if (e.key.toLowerCase() === "escape") {
            this.handleCreateMapMarkerCancel();
        }
    }

    /**
     * Rerender on resize
     */
    public handleWindowResize(e: Event) {
        this.mapCanvasRerender++;
    }

    /**
     * Get map keys that are not temporary
     */
    public get computedMapKeysNotTemporary() {
        return this.mapKeys.filter((m) => {
            return (m.mapKeyTemporary) ? false : true;
        });
    }

    /**
     * Computed property
     * that returns an array of map markers
     * that belong to the selected map key filter
     */
    public get computedMapMarkersFiltered() {
        return this.mapMarkers.filter((m) => {
            if (!this.mapKeysSelectedFilter) {
                return true;
            }
            return this.mapKeysSelectedFilter == m.mapMarkerKey;
        });
    }

    /**
     * Set menu item active
     */
    public setMenuItemActive(menuItem: any) {
        this.menuItems.forEach((m) => {
            m.active = false;
        });
        menuItem.active = true;
		window.localStorage.setItem('active-menu-item', menuItem.name);
    }

    /**
     * Get active menu item name
     */
    public get activeMenuItemName() {
        for (let i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].active)
                return this.menuItems[i].name;
        }
        return null;
    }

    /**
     * Copy iframe embed code to clipboard
     */
    public copyIframeEmbedToClipboard(e: any) {
        const el = document.createElement('textarea');
        el.value = this.iframeCode;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
		this.copyEmbedBtnText = "Copied!";
		setTimeout(() => {
			this.copyEmbedBtnText = "Copy";
		}, 500);
    }

}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.edit-map-page {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;

    &.map-marker-cursor {
        cursor: url('~@/assets/map-marker-white-shadow-cursor.png') 16 32, auto !important;

        .right-panel {
            pointer-events: none !important;
        }

        .left-panel {

            .marker-drop-zone {
                opacity: 1;
            }

        }
    }

    .left-panel {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100% - 330px);
        height: 100%;
        background-color: #f1f1f1;
        z-index: 1;

        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            //box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
        }

        .marker-drop-zone {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            color: #FFF;
            background-color: rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: opacity 200ms;
            border: 2px dashed #09f;

            .marker-drop-zone-helper-text {
                position: absolute;
                bottom: 10px;
                left: calc(50% - 120px);
                width: 240px;
                padding: 6px 8px;
                border-radius: 2px;
                text-align: center;
                background-color: rgba(#323232, 0.975);
                box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 rgb(0 0 0 / 12%);

                h6 {
                    font-weight: 500;
                    font-size: 13px;
                }

                p {
                    font-size: 12px;
                }
            }

        }

    }

    .right-panel {
        position: relative;
        float: left;
        width: 336px;
        height: 100vh;
        overflow: hidden;
        background-color: theme-color("white");
        color: darken(#6C7D8B, 10%);
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        box-shadow: 0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
        box-shadow: 0 0.46875rem 2.1875rem rgba(0, 0, 0, 0.03), 0 0.9375rem 1.40625rem rgba(0, 0, 0, 0.03), 0 0.25rem 0.53125rem rgba(0, 0, 0, 0.05), 0 0.125rem 0.1875rem rgba(0, 0, 0, 0.03);
        z-index: 2;

        .right-panel-parent-menu {
            position: relative;
            float: left;
            width: 60px;
            height: 100%;
            background-color: #F8F8FA;
            border-right: 1px solid darken(#F8F8FA, 5%);
            z-index: 2;

            .right-panel-parent-menu-title {
                position: relative;
                display: block;
                height: 66px;
                padding: 8px;
                text-align: center;

                i {
                    height: 44px;
                    width: 44px;
                    font-size: 20px;
                    line-height: 42px;
                    border-radius: 50px;
                    background-color: theme-color("primary");
                    color: theme-color("white")
                }

                &::before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 6px;
                    width: calc(100% - 12px);
                    height: 1px;
                    background-color: darken(#F8F8FA, 5%);
                }
            }

            .right-panel-parent-menu-items {
                position: relative;
                display: block;
                height: calc(100% - 66px);
                padding: 12px 0px;

                .right-panel-parent-menu-items-item {
                    position: relative;
                    display: block;
                    width: calc(100% - 16px);
                    height: 44px;
                    margin: 8px;
                    text-align: center;
                    line-height: 44px;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: background-color 60ms, color 60ms;

                    &:hover {
                        background-color: theme-color("primary");
                        color: theme-color("white");
                        transition: background-color 120ms, color 120ms
                    }

                    &.active,
                    &:active {
                        background-color: theme-color("primary") !important;
                        color: theme-color("white") !important;
                    }
                }
            }
        }

        .right-panel-parent-menu-content {
            position: relative;
            float: left;
            width: calc(100% - 60px);
            height: 100%;
            background-color: #FFF;
            z-index: 1;

            .right-panel-parent-menu-content-inner {
                position: relative;
                display: block;
                width: 100%;
                height: 100%;
                overflow-y: overlay;
                overflow-x: hidden;

                p {
                    font-size: 13px;
                }

                &.right-panel-parent-menu-content-inner-enter-active {
                    transition: all 360ms cubic-bezier(.2, .5, .1, 1);
                }

                &.right-panel-parent-menu-content-inner-leave-active {
                    transition: none !important;
                }

                &.right-panel-parent-menu-content-inner-enter {
                    transform: translateX(-12px);
                    opacity: 0;
                }

                &.keys {

                    .map-keys-btn-group {
                        border: none !important;

                        .list-group-item {
                            background-color: #F8F8FA;
                            color: darken(#6C7D8B, 10%);
                            padding: 0.5rem !important;
                            border-color: darken(#F8F8FA, 5%) !important;

                            &:hover {
                                background-color: darken(#F8F8FA, 5%) !important;
                                border-color: darken(#F8F8FA, 5%) !important;
                            }

                            &.active {
                                background-color: #F8F8FA !important;
                                border-color: darken(#F8F8FA, 5%) !important;
                            }

                            &.disabled {
                                color: lighten(#6C7D8B, 30%) !important;
                                pointer-events: none;
                                opacity: 0.75;
                            }

                        }

                    }

                    .map-keys-list {
                        position: relative;
                        display: block;
                        width: 100%;
                        height: auto;
                    }

                }

                &.markers {

                    .map-markers-btn-group {
                        border: none !important;

                        .list-group-item {
                            background-color: #F8F8FA;
                            color: darken(#6C7D8B, 10%);
                            padding: 0.5rem !important;
                            border-color: darken(#F8F8FA, 5%) !important;

                            &:hover {
                                background-color: darken(#F8F8FA, 5%) !important;
                                border-color: darken(#F8F8FA, 5%) !important;
                            }

                            &.active {
                                background-color: #F8F8FA !important;
                                border-color: darken(#F8F8FA, 5%) !important;
                            }

                            &.disabled {
                                color: lighten(#6C7D8B, 30%) !important;
                            }

                        }
                    }

                    .map-markers-list {
                        position: relative;
                        display: block;
                        width: 100%;
                        height: auto;
                        //padding: 12px 12px 0px 12px;

                        .map-marker-item-ghost {
                            background-color: lighten(theme-color("primary"), 40%) !important;
                        }
                    }
                }

            }
        }

    }
}
</style>
