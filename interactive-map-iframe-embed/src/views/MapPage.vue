<template>
    <div 
        class="map-page" 
        :class="(this.map && this.map.mapPitchedBookingEnabled && this.map.mapPitchedBookingURL) ? 'map-page-with-widget' : ''" 
        v-on:mousewheel="handleMouseWheelEvent"
    >

        <!-- WebGL error message -->
        <transition name="map-page-error" mode="out-in">
            <div class="map-page-error" v-if="this.pixiError">
                <div class="row h-100 justify-content-center">
                    <div class="col-10 col-md-6 align-self-center">
                        <div class="map-page-error-content">
                            <div class="row no-gutters justify-content-center">
                                <div class="col-10 text-center">
                                    <i class="fas fa-frown"></i>
                                </div>
                            </div>
                            <div class="row no-gutters justify-content-center mt-3">
                                <div class="col-10 text-center">
                                    <p>Sorry, your browser does not support WebGL. Please try updating your browser to use the interactive map.</p>
                                    <p>Find out more <a target="_blank" href="https://get.webgl.org/">here.</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
		
        <!-- Map doesn't exist error message -->
        <transition name="map-page-doesnt-exist-error" mode="out-in">
            <div class="map-page-doesnt-exist-error" v-if="this.mapDoesntExistError">
                <div class="row h-100 justify-content-center">
                    <div class="col-10 col-md-6 align-self-center">
                        <div class="map-page-error-content">
                            <div class="row no-gutters justify-content-center">
                                <div class="col-10 text-center">
                                    <i class="fas fa-search-location"></i>
                                </div>
                            </div>
                            <div class="row no-gutters justify-content-center mt-3">
                                <div class="col-10 text-center">
                                    <p>Sorry, this map could not be found.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Loader -->
        <transition name="map-page-loader" mode="out-in">
            <div class="map-page-loader" v-if="(mapLoading || mapRendering) && !pixiError">
                <div class="row h-100 justify-content-center">
                    <div class="col-12 col-md-8 align-self-center">
                        <div class="row no-gutters justify-content-center">
                            <div class="col-12 text-center">
                                <i class="fas fa-map-marker-alt loading-icon"></i>
                            </div>
                        </div>
                        <div class="row no-gutters justify-content-center mt-3">
                            <div class="col-12 text-center">
                                <p><i class="fas fa-spinner fa-spin mr-2"></i> <span class="map-page-loader-map-title">{{ this.map ? this.map.mapTitle : "" }}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="map-page-loader-pitched">
                    <div class="row no-gutters justify-content-center">
                        <div class="col-12 text-center">
                            <p class="mb-1">Powered By</p>
                            <img class="map-page-loader-pitched-logo" src="@/assets/pitched-logo-white.png" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Map Renderer Component -->
        <map-renderer 
            class="map-page-map-renderer"
            :key="this.mapCanvasRerender"
            v-if="!this.mapLoading && !this.pixiError"
            v-bind:map-image="this.map.mapImage.imagePath"
            v-bind:markers="this.mapMarkersFiltered()"
            v-bind:keys="this.mapKeys"
            v-bind:disabled="this.mapMarkerModalOpen || this.bookingWidgetModalOpen || this.keyModalOpen"
            v-on:ready="mapRendering = false"
            v-on:marker-select="mapMarkerSelect"
            v-on:marker-hover="mapMarkerHover"
            v-on:marker-unhover="mapMarkerUnhover"
            v-on:pixi-error="onPixiError"
        />

        <!-- Booking widget -->
        <lucid-modal
            class="map-page-booking-widget-popup"
            v-if="this.map && this.map.mapPitchedBookingEnabled && this.map.mapPitchedBookingURL && !this.pixiError"
            :width="360"
			:dissmissible.sync="bookingWidgetModalDismissible"
            :open.sync="bookingWidgetModalOpen">
            <template v-slot:header>
                <h5 class="mb-0">Check Availability</h5>
            </template>
            <template v-slot:content>
                <div class="d-block">
                    <pitched-widget 
                        class="pitched-widget" 
                        v-bind:busy="pitchedWidgetBusy"
                        v-bind:invalid-feedback="pitchedWidgetInvalidFeedback"
                        v-bind:holiday-type.sync="selectedHolidayType"
                        v-bind:arrival-date.sync="selectedArrivalDate"
                        v-bind:duration.sync="selectedDuration"
                        v-bind:party-size.sync="selectedPartySize"
                        v-on:success="onPitchedWidgetSuccess"
                        v-on:clear="onPitchedWidgetClear"
                    />
                </div>
            </template>
        </lucid-modal>

        <!-- Key Popup -->
        <lucid-modal 
            class="map-page-key-mobile"
            v-if="windowWidth < 768000 && !this.mapLoading && !this.pixiError"
            :width="330"
            :open.sync="keyModalOpen">
            <template v-slot:header>
                <h5 class="mb-0">Filter by Key</h5>
            </template>
            <template v-slot:content>
                <div class="d-block">
                    <div 
                        class="row no-gutters mb-3"
                        v-for="mapKey in mapKeys" 
                        v-bind:key="mapKey.mapKeyId">
                        <div class="col-12">
                            <lucid-checkbox 
                                :color="mapKey.mapKeyColor"
                                :checked.sync="mapKey.mapKeySelected"
                                v-on:check="mapKeySelect(mapKey.mapKeyId)"
                                v-on:uncheck="mapKeyUnselect(mapKey.mapKeyId)">
                                {{ mapKey.mapKeyTitle }}
                            </lucid-checkbox>
                        </div>
                    </div>
                </div>
            </template>
        </lucid-modal>

        <!-- Buttons -->
        <div class="map-page-toolbar" v-if="!this.pixiError">
            <div class="row h-100 no-gutters">
                <div class="col-4 col-md-8">
                    <b-button
                        class="map-page-fullscreen-btn"
                        variant="primary" 
                        v-ripple="'rgba(33, 105, 246, 0.75)'"
                        v-b-tooltip.hover="{ title: 'Toggle fullscreen', placement: 'top', boundary: 'viewport', delay: { show: 300, hide: 0  } }"
                        pill
                        v-on:click="toggleFullscreen">
                        <i v-if="!fullScreenMode" class="fas fa-expand mr-2"></i>
                        <i v-else class="fas fa-compress mr-2"></i>
                        <span>Fullscreen</span>
                    </b-button>
                    <b-button
                        class="map-page-open-key-btn"
                        variant="primary" 
                        v-ripple="'rgba(33, 105, 246, 0.75)'"
                        v-b-tooltip.hover="{ title: 'Show Key', placement: 'top', boundary: 'viewport', delay: { show: 300, hide: 0  } }"
                        pill
                        v-on:click="keyModalOpen = true">
                        <i class="fas fa-key mr-2"></i>
                        <span>Key</span>
                    </b-button>
                </div>
                <div class="col-8 col-md-4 text-right">
                    <b-button
						v-if="this.map && this.map.mapPitchedBookingEnabled && this.map.mapPitchedBookingURL"
                        class="map-page-open-widget-btn"
                        variant="primary" 
                        v-ripple="'rgba(255,255,255,0.9)'"
                        pill
                        v-on:click="bookingWidgetModalOpen = true">
                        <i class="fas fa-calendar-check mr-2"></i>
                        <span>Check Availability</span>
                    </b-button>
                </div>
            </div>

        </div>

        <!-- Map Marker info modal -->
        <lucid-modal
            class="map-page-marker-popup"
            :open.sync="mapMarkerModalOpen"
            v-if="!this.mapLoading && !this.pixiError"
            :width="540">
            <template v-slot:header>
                <div class="row no-gutters">
                    <div class="col-12">
                        <h5 class="mb-0 map-page-marker-popup-title">
                            <i class="fas fa-map-marker-alt mr-2" :style="`color:#${mapMarkerSelectedKeyColor}`"></i> 
							{{ mapMarkerSelected.mapMarkerTitle }}
                        </h5>
                    </div>
                </div>
            </template>
            <template v-slot:content>
                <div class="map-page-marker-popup-info">

                    <!-- Carousel -->
                    <div class="row no-gutters mb-3" v-if="mapMarkerSelected.mapMarkerImagesEnabled && mapMarkerSelected.mapMarkerImages && mapMarkerSelected.mapMarkerImages.length > 0 ">
                        <div class="col-12">
                            <b-carousel
                                id="carousel-1"
                                class="map-page-marker-popup-carousel"
                                :interval="4000"
                                indicators
                                background="#ababab">
                                <b-carousel-slide 
                                    class="map-page-marker-popup-carousel-item"
                                    v-for="item in mapMarkerSelected.mapMarkerImages" 
                                    v-bind:key="item.imageId">
                                    <template #img>
                                        <div
                                            class="map-page-marker-popup-carousel-img"
                                            :style="`background-image:url(${item.imagePath})`"
                                        ></div>
                                    </template>
                                </b-carousel-slide>
                            </b-carousel>
                        </div>
                    </div>

                    <!-- Holiday Price -->
                    <div class="row no-gutters mb-3" v-if="mapMarkerSelected.mapMarkerState === 'available'">
                        <div class="col-12">
                            <div class="map-page-marker-popup-holiday-price text-center">
                                <div class="map-page-marker-popup-holiday-price-bg" :style="`background-color:#${mapMarkerSelectedKeyColor}`"></div>
                                <p class="mb-2" v-html="computedBookNowText"></p>
                                <h3 class="map-page-marker-popup-holiday-price-amount mb-3" >£{{mapMarkerSelected.mapMarkerPrice}}</h3>
                                <b-button 
                                    class="map-page-marker-popup-book-now-btn"
                                    variant="primary" 
                                    :style="`background-color:#${mapMarkerSelectedKeyColor}`"
                                    block
                                    pill
                                    v-ripple="'rgba(255,255,255,0.75)'"
                                    target="_blank"
                                    :href="`${map.mapPitchedBookingURL}book`">
                                    Book Now
                                </b-button>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="row no-gutters mb-3" v-if="mapMarkerSelected.mapMarkerDescription">
                        <div class="col-12 text-center">
                            <p class="m-0 map-page-marker-popup-description" v-if="mapMarkerSelected.mapMarkerDescription" v-html="mapMarkerSelected.mapMarkerDescription">{{ mapMarkerSelected.mapMarkerDescription }}</p>
                        </div>
                    </div>

                    <!-- Button -->
                    <div class="row no-gutters mb-3" v-if="mapMarkerSelected.mapMarkerButtonEnabled">
                        <div class="col-12">
                            <b-button 
                                class="map-page-marker-popup-find-out-more-btn"
                                variant="primary" 
                                :style="`background-color:#${mapMarkerSelectedKeyColor}`"
                                block
                                pill
                                v-ripple="'rgba(255,255,255,0.75)'"
                                target="_blank"
                                :href="mapMarkerSelected.mapMarkerButtonURL">
                                {{ mapMarkerSelected.mapMarkerButtonLabel }}
                                <i class="fas fa-external-link-alt ml-1"></i>
                            </b-button>
                        </div>
                    </div>
                </div>
            </template>
        </lucid-modal>
    
    </div>
</template>

<script lang="ts">
import MapKeyClient from '@/models/MapKeyModels/MapKey.client';
import MapKeyEditor from '@/models/MapKeyModels/MapKey.editor';
import MapMarkerClient from '@/models/MapMarkerModels/MapMarker.client';
import MapMarkerEditor from '@/models/MapMarkerModels/MapMarker.editor';
import MapClient from '@/models/MapModels/Map.client';
import RepositoryFactory from '@/repositories/RepositoryFactory';
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';
import debounce from 'lodash.debounce';
import ICheckAvailability from '@/models/PitchedModels/CheckAvailability';

/**
 * Define the MapPage component using the class style syntax.
 */
@Component({ })
export default class MapPage extends Vue {

    // Register the various properties required for this component.
    public map: MapClient | null = null;
    public mapKeys: Array<MapKeyEditor> = [];
    public mapMarkers: Array<MapMarkerEditor> = [];
    public mapMarkerSelected: MapMarkerEditor | null = null;
    public mapLoading:boolean = true;
    public mapRendering:boolean = true;
    public mapRendererDisabled: boolean = false;
    public mapCanvasRerender = 0;
    public mapMarkerModalOpen = false;
    public keyModalOpen = false;
    public bookingWidgetModalOpen = false;
	public bookingWidgetModalDismissible = true;
    public windowWidth = window.innerWidth;
    public fullScreenMode = false;
    public pixiError = false;
    public mapDoesntExistError = false;

    public pitchedWidgetBusy = false;
    public pitchedWidgetInvalidFeedback = "";
    public selectedHolidayType = 'all';
    public selectedArrivalDate = '';
    public selectedDuration = 0;
    public selectedPartySize = 0;
    
    /**
     * On component create.
	 * Add a window resize event listener to allow the map to resize correctly.
     */
    public created() {
        window.addEventListener('resize', debounce(this.handleWindowResize, 300));
    }

    /**
     * On mounted
	 * This is the most important function, and is similiar to a constructor.
	 * It's runs when the component has been added to the page. 
     */
    public async mounted() {

        // Firstly, set the mapLoading variable to true.
		// This makes sure the loading page is shown before the map is ready (line 55, v-if).
        this.mapLoading = true;

        // Next, make a request to the API to get the current map (line 383).
        this.map = await this.getMap();
        
        // If the getMap function returned null, the map doesn't exist.
		// So set the mapDoesntExistError property is true.
		// This will ensure an error message is shown (line 32)
        if (this.map == null) {
			this.mapDoesntExistError = true;
			return;
        }
		
        // Set document title, incase it's bookmarked
        document.title = this.map.mapTitle + " - Interactive map";

        // Get map keys and markers.
		// Functions similiarly to the getMap function.
		// However, no error handling is required since these may well be empty.
        this.mapKeys = await this.getMapKeys();
        this.mapMarkers = await this.getMapMarkers();

        // Map is no longer loading,
		// so set to false to hide the loading page.
        this.mapLoading = false;

    }

    /**
     * Destroy
     */
    public beforeDestroy() {
        window.removeEventListener('resize', this.handleWindowResize)
    }

    /**
     * Get the currently viewed map.
	 * - Utilises the Repository Factory to get an instance of the Maps Repository.
	 * - Get the Map based on the ID shown in the URL.
	 * - Map API response to a MapClient object.
	 * - If the map doesn't exist, return null.
     */
    private async getMap() : Promise<MapClient | null> {
        const response = await new RepositoryFactory().getMapsRepository().getOne(this.$route.params.id);
        if (response.is200) {
            return new MapClient({
                mapId: response.is200.data.mapId,
                mapUser: response.is200.data.mapUser,
                mapTitle: response.is200.data.mapTitle,
                mapDescription: response.is200.data.mapDescription,
                mapImage: response.is200.data.mapImage ? response.is200.data.mapImage : undefined,
                mapPitchedBookingEnabled: response.is200.data.mapPitchedBookingEnabled,
                mapPitchedBookingURL: response.is200.data.mapPitchedBookingURL,
            })
        }
        return null;
    }

    /**
     * Get keys for current viewerd map
     */
    private async getMapKeys() : Promise<Array<MapKeyEditor>> {
        const response = await new RepositoryFactory().getMapKeysRepository(this.$route.params.id).get();
        if (response.is200) {
            return response.is200.data.map((m : MapKeyClient) => {
                const k = new MapKeyEditor({
                    ...m,
                });
                return k;
            });
        }
        return [];
    }

    /**
     * Get map key by id
     */
    private getMapKeyById(id: string) {
        return this.mapKeys.find((mk) => {
            return mk.mapKeyId === id;
        });
    }

    /**
     * Get map markers for this map
     */
    private async getMapMarkers() : Promise<Array<MapMarkerEditor>> {
        const response = await new RepositoryFactory().getMapMarkersRepository(this.$route.params.id).get();
        if (response.is200) {
            return response.is200.data.map((m : MapMarkerClient) => {
                const marker = new MapMarkerEditor({
                    ...m,
                    mapMarkerSelected: false,
                });
                return marker;
            }).sort((a, b) => (a.mapMarkerOrder > b.mapMarkerOrder) ? 1 : -1);
        }
        return [];
    }

    /**
     * Get map marker by id
     */
    private getMapMarkerById(id : string) {
        return this.mapMarkers.find((m) => {
            return m.mapMarkerId === id;
        });
    }

    /**
     * On map marker select.
	 * Take in the map marker id.
	 * Iterate through all map markers, and set all as unselected,
	 * expect the marker with the id that was passed through.
	 * Of course, selecting a map marker should open the pop up dialog with it's information (line 196).
     */
    public mapMarkerSelect(mapMarkerId : string) {
        if (mapMarkerId === null) 
            this.mapMarkerSelected = null;
        this.mapMarkers.forEach((m) => {
            if (m.mapMarkerId === mapMarkerId) {
                m.mapMarkerSelected = true;
                this.mapMarkerSelected = m;
            } else {
                m.mapMarkerSelected = false;
            }
        });
        if (this.mapMarkerSelected)
            this.mapMarkerModalOpen = true;
    }
    
    /**
     * On map marker hover
     */
    public mapMarkerHover(mapMarkerId : string) {
        const marker = this.getMapMarkerById(mapMarkerId);
        if (marker) {
            marker.mapMarkerHovered = true;
        }
    }
    
    /**
     * On map marker unhover
     */
    public mapMarkerUnhover(mapMarkerId : string) {
        const marker = this.getMapMarkerById(mapMarkerId);
        if (marker) {
            marker.mapMarkerHovered = false;
        }
    }

    /**
     * On map key select
     */
    public mapKeySelect(mapKeyId: string) {
        const mapKey = this.getMapKeyById(mapKeyId);
        if (mapKey) {
            mapKey.mapKeySelected = true;
        }
    }

    /**
     * On map key unselect
     */
    public mapKeyUnselect(mapKeyId: string) {
        const mapKey = this.getMapKeyById(mapKeyId);
        if (mapKey) {
            mapKey.mapKeySelected = false;
        }
    }

    /**
     * Return an array of map markers
     * that belong to the selected map keys filter
     */
    public mapMarkersFiltered() {
        return this.mapMarkers.filter((m) => {
            if (!m.mapMarkerKey)
                return true;
            const exists = this.mapKeys.find((mk) => {
                return mk.mapKeySelected && mk.mapKeyId === m.mapMarkerKey;
            });
            return exists ? true : false;
        });
    }

    /**
     * Get the map key color of the selected map marker
     */
    public get mapMarkerSelectedKeyColor() {
        const selected = this.mapMarkerSelected;
        if (selected) {
            const key = this.getMapKeyById(selected.mapMarkerKey);
            if (key) {
                return key.mapKeyColor;
            }
        }
        return "#dc3545";
    }










    /**
     * Rerender on resize
     */
    public handleWindowResize(e : Event) {
        this.mapCanvasRerender++;
        this.windowWidth = window.innerWidth;
    }

    /**
     * Handle pitch widget search results
     */
    public async onPitchedWidgetSuccess(searchOptions : ICheckAvailability) {
		this.bookingWidgetModalDismissible = false;
        this.pitchedWidgetBusy = true;
        const repo = new RepositoryFactory().getPitchedRepository(this.map?.mapPitchedBookingURL as string);
        const result = await repo.checkAvailability({
            holidayType: searchOptions.holidayType,
            arrivalDate: searchOptions.arrivalDate,
            duration: searchOptions.duration,
            partySize: searchOptions.partySize,
        });
        if (result.is200) {
            this.mapMarkers.forEach((m) => {
                if (m.mapMarkerPitchedUnitSelection) {
                    let available = result.is200.data.find(d => d.unitId.toString() === m.mapMarkerPitchedUnitSelection);
                    if (available) {
                        m.mapMarkerState = "available";
                        m.mapMarkerPrice = available.price;
                        if (m.mapMarkerKey) {
                            this.mapKeys.forEach((mk) => {
                                if (mk.mapKeyId === m.mapMarkerKey) {
                                    mk.mapKeySelected = true;
                                }
                            })
                        }
                    } else {
                        m.mapMarkerState = "unavailable";
                    }
                } else {
                    m.mapMarkerState = "not_a_pitched_unit";
                }
            });
            this.pitchedWidgetBusy = false;
            this.bookingWidgetModalOpen = false;
			this.bookingWidgetModalDismissible = true;
            this.pitchedWidgetInvalidFeedback = "";

        } else {
            this.pitchedWidgetInvalidFeedback = "Sorry, there was an error. Please try again later.";
            this.pitchedWidgetBusy = false;
			this.bookingWidgetModalDismissible = true;
		}
    }

	/**
	 * Clear booking widget
	 */
    public onPitchedWidgetClear() {
        this.mapMarkers.forEach((m) => {
            m.mapMarkerState = "default";
        });
        this.bookingWidgetModalOpen = false;
		this.bookingWidgetModalDismissible = true;
    }

    public handleMouseWheelEvent(e : Event) {
        const target = e.target as HTMLElement;
        if (target.tagName === "CANVAS") {
            e.preventDefault();
        }
    }

    public async toggleFullscreen(e: Event) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            this.fullScreenMode = true;
        } else {
            document.exitFullscreen();
            this.fullScreenMode = false;
        }
    }

    public createDynamicManifest() {
        
        // Create the dyanmic manifest
        var myDynamicManifest = {
            "theme_color": "#2169F6",
            "background_color": "#2169F6",
            "display": "standalone",
            "scope": "/",
            "start_url": "/" + this.$route.params.id,
            "name": this.map?.mapTitle + " - Interactive map",
            "short_name": this.map?.mapTitle + " - Interactive map",
            "icons": [
                {
                    "src": "/img/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/img/icons/icon-256x256.png",
                    "sizes": "256x256",
                    "type": "image/png"
                },
                {
                    "src": "/img/icons/icon-384x384.png",
                    "sizes": "384x384",
                    "type": "image/png"
                },
                {
                    "src": "/img/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ]
        }
        const blob = new Blob([JSON.stringify(myDynamicManifest)], {type: 'application/json'});
        const manifestURL = URL.createObjectURL(blob);
        return manifestURL;
    }

    public onPixiError(err: any) {
        this.pixiError = true;
    }

    public get computedBookNowText() {
        var date = this.selectedArrivalDate.split('-');
        return `
            Your price based on a ${this.selectedDuration} night stay
            for ${this.selectedPartySize} people<br> 
            arriving on ${date[2]}/${date[1]}/${date[0]}
        `

    }

}
</script>


<style lang="scss" >
@import '../scss/variables.scss';

.map-page {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    user-select: none;
        
    .map-page-error {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color:theme-color("text");
        color: theme-color("white");
        transition: opacity 300ms linear;
        z-index: 10000;
        
        &-enter,
        &-leave-to {
            opacity: 0;
        }

        .map-page-error-content {
            position: relative;
            display: block;
            padding: 24px;
            background-color: theme-color("danger");
            border-radius: 8px;

            i {
                font-size: 48px;
            }
            
            a {
                color: theme-color("white");
                text-decoration: underline!important;
            }
        }
    }

    .map-page-doesnt-exist-error {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color:theme-color("primary");
        color: theme-color("text");
        transition: opacity 300ms linear;
        z-index: 10000;
        
        &-enter,
        &-leave-to {
            opacity: 0;
        }

        .map-page-error-content {
            position: relative;
            display: block;
            padding: 24px;
            background-color:#fbfbfb;
            border-radius: 8px;

            i {
                font-size: 48px;
				color: theme-color("danger")
            }
            
            a {
                color: theme-color("white");
                text-decoration: underline!important;
            }
        }
    }
    
    .map-page-loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color:theme-color("primary");
        color: #FFF;
        transition: opacity 300ms linear;
        z-index: 9999;

        &-enter,
        &-leave-to {
            opacity: 0;
        }

        @keyframes bouncing-animation {
            0%   { transform: scale(1,1)      translateY(0); }
            10%  { transform: scale(1.1,.9)   translateY(0);  }
            30%  { transform: scale(.9,1.1)   translateY(-12px);}
            50%  { transform: scale(1.05,.95) translateY(0); }
            57%  { transform: scale(1,1)      translateY(-1px); }
            64%  { transform: scale(1,1)      translateY(0); }
            100% { transform: scale(1,1)      translateY(0); }
        }

        .loading-icon {
            font-size: 36px;
            animation-duration: 1500ms;
            animation-iteration-count: infinite;
            animation-name: bouncing-animation;
            animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
        }

        .map-page-loader-pitched {
            position: absolute;
            bottom: 0;
            left: 0px;
            width: 100%;
            padding: 12px;

            p {
                color: #f1f1f1;
                font-size: 12px;
            }

            .map-page-loader-pitched-logo {
                position: relative;
                display: inline-block;
                vertical-align: top;
                width: 100px;
                height: auto;
            }

        }

    }

    .map-page-map-renderer {
        height:calc(100% - 54px);
    }

    .map-page-toolbar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        padding: 9px;
        background-color: theme-color("white");
        box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%);
        z-index: 999;
        
        .map-page-open-key-btn,
        .map-page-fullscreen-btn {
            position: relative;
            display: inline-block;
            vertical-align: top;
            height: 42px;
            line-height: 42px;
            width: auto;
            padding: 0px 18px!important;
            outline: none!important;
            border: none!important;
            box-shadow: none!important;
            color: theme-color("text")!important;
            background-color: theme-color("white")!important;
            margin-right: 6px;

            &:hover,
            &:active,
            &:focus {
                background-color: darken(theme-color("white"), 5%)!important;
            }

            @include breakpoint($md-down) {
                border-radius: 50px!important;
                padding: 0px!important;
                width: 42px!important;

                span {
                    display: none!important;
                }

                i {
                    margin: 0px!important;
                }

            }
        }

        .map-page-open-widget-btn {
            position: relative;
            display: inline-block;
            vertical-align: top;
            height: 42px;
            line-height: 42px;
            width: auto;
            padding: 0px 18px!important;
            //margin-top: -6px;
            outline: none!important;
            border: none!important;
            box-shadow: none!important;
            color: theme-color("white")!important;
            background-color: theme-color("primary")!important;
            //transform: translateY(-50%);
        }


    }

    .map-page-mobile-toolbar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 54px;
        z-index: 10;
        box-shadow: 0 0.46875rem 2.1875rem rgba(0, 0, 0, 0.03), 0 0.9375rem 1.40625rem rgba(0, 0, 0, 0.03), 0 0.25rem 0.53125rem rgba(0, 0, 0, 0.05), 0 0.125rem 0.1875rem rgba(0, 0, 0, 0.03);
        border-top: 1px solid #f1f1f1;
        background-color: rgba(255,255,255,1);
        backdrop-filter: blur(10px);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;

        .map-page-mobile-toolbar-btn {
            position: relative;
            outline: none!important;
            border: none!important;
            box-shadow: none !important;
            border-radius: 0.25rem!important;
            padding: 8px 16px!important;
            font-size: 0.875rem;

            &.map-page-mobile-toolbar-btn-filter {
                background-color:rgba(theme-color("primary"), 0.15)!important;
                color: theme-color("primary")!important;
            }

            &::before {
                content:"";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.05);
                opacity: 0;
                transition: opacity 200ms;
            }

            &:hover,
            &:focus,
            &:active {

                &::before {
                    opacity: 1;
                }
            }

        }
    }
    
}

.map-page-marker-popup {
        
    .map-page-marker-popup-info {
        position: relative;
        display: block;
        width: 100%;

        .map-page-marker-popup-carousel {
            position: relative;
            height: 180px;
            margin: 0 auto;

            .carousel-inner {
                height: 100%;
            }

            .carousel-item {
                height: 100%;
            }

            .carousel-indicators li {
                box-sizing: content-box;
                flex: 0 1 auto;
                width: 12px!important;
                height: 12px!important;
                margin-right: 3px;
                margin-left: 3px;
                text-indent: -999px;
                cursor: pointer;
                background-color: #FFFFFF;
                border-radius: 50%;
                background-clip: padding-box;
                border-top: 0px solid transparent;
                border-bottom: 0px solid transparent;
                opacity: 0.75;
                transition: opacity 0.6s ease;
                outline: none!important;
                box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.2);

                &.active {
                    opacity: 1!important;
                }
            }

            .map-page-marker-popup-carousel-img {
                width: 100%;
                height: 100%;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;

            }
        }

        .map-page-marker-popup-description {
            white-space: pre-wrap;

            @include breakpoint($lg-down) {
                font-size: 13px!important;
            }

            @include breakpoint($md-down) {
                font-size: 12px!important;
            }
        }

        .map-page-marker-popup-holiday-price {
            position: relative;
            display: block;
            border-radius: 0.25rem!important;
            padding: 12px;
            overflow: hidden;

            .map-page-marker-popup-holiday-price-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0.15;
            }

            > p {
                
                @include breakpoint($lg-down) {
                    font-size: 13px!important;
                }

                @include breakpoint($md-down) {
                    font-size: 12px!important;
                }
            }

            .map-page-marker-popup-holiday-price-amount {
                font-weight: bold;
            }

            .map-page-marker-popup-book-now-btn {
                position: relative;
                outline: none!important;
                border: none!important;
                box-shadow: none !important;
                padding: 8px 16px!important;
                margin: 0 auto;
                max-width: 300px;

                @include breakpoint($lg-down) {
                    font-size: 13px!important;
                }

                @include breakpoint($md-down) {
                    font-size: 12px!important;
                }

                &::before {
                    content:"";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.05);
                    opacity: 0;
                    transition: opacity 200ms;
                }

                &:hover,
                &:focus,
                &:active {

                    &::before {
                        opacity: 1;
                    }
                }
            }
        }

        .map-page-marker-popup-find-out-more-btn {
            position: relative;
            outline: none!important;
            border: none!important;
            box-shadow: none !important;
            padding: 8px 16px!important;
            margin: 0 auto;
            max-width: 300px;

            @include breakpoint($lg-down) {
                font-size: 13px!important;
            }

            @include breakpoint($md-down) {
                font-size: 12px!important;
            }

            &::before {
                content:"";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.05);
                opacity: 0;
                transition: opacity 200ms;
            }

            &:hover,
            &:focus,
            &:active {

                &::before {
                    opacity: 1;
                }
            }

        }

    }
}

</style>
