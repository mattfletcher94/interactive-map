<template>
    <div 
        class="map-renderer" 
        ref="mapRendererCanvasWrapper"
    ></div>
</template>

<script lang="ts">
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import Cull from 'pixi-cull'
import { Component, Prop, Ref, Vue, Watch, } from 'vue-property-decorator';
import { PropType } from 'vue';
import MapClient from '@/models/MapModels/Map.client';
import MapMarkerEditor from '@/models/MapMarkerModels/MapMarker.editor';
import MapKeyEditor from '@/models/MapKeyModels/MapKey.editor';
import differenceBy from 'lodash.differenceby';
import pull from 'lodash.pull';
import throttle from 'lodash.throttle';

/**
 * Define the MapRenderer component.
 * Register Props, not to be confused with class properties.
 * A prop simply defines what variables can be passed through the HTML attributes.
 */
@Component({ })
export default class MapRenderer extends Vue {

    /**
     * Reference elements
     */
    @Ref('mapRendererCanvasWrapper') readonly mapRendererCanvasWrapper!: HTMLElement;

    /**
     * Register map prop
     */
    @Prop({ type: String, default: "" }) public readonly mapImage!: string

    /**
     * Register map markers
     */
    @Prop({ type: Array as PropType<Array<MapMarkerEditor>>, default: () => [] }) public readonly markers!: Array<MapMarkerEditor>

    /**
     * Register map keys
     */
    @Prop({ type: Array as PropType<Array<MapKeyEditor>>, default: () => [] }) public readonly keys!: Array<MapKeyEditor>

    /**
     * Register selected keys
     */
    @Prop({ type: Array as PropType<Array<MapKeyEditor>>, default: () => [] }) public readonly selectedKeys!: Array<MapKeyEditor>

    /**
     * Register disabled prop
     */
    @Prop({ type: Boolean, default: true }) public readonly disabled!: boolean

    /**
     * Is there an error with the pixi.js renderer?
     */
    public pixiError: boolean = false;

    /**
     * Reference the pixi application
     */
    public pixiApp!: PIXI.Application;

    /**
     * Reference the pixi viewport
     */
    public pixiViewport!: Viewport;

	/**
	 * Reference Pixi cull
	 */
	public pixiCull!: Cull.Simple;

    /**
     * An array of sprites to render
     */
    public pixiMapMarkerSprites: Array<PIXI.Container> = [];
    
    /**
     * Track watchers
     */
    public watchTracker: any[] = [];

    /**
     * Is the map ready?
     */
    public ready:boolean = false;
    
    /**
     * RAF id
     */
    public renderLoopId: number = 0;

    /**
     * Map marker size
     */
    public mapMarkerSize = 36;

    /**
     * Multiplyer for min zoom
     */
    public minZoomMultiplyer = 1;

    /**
     * Text style
     */
    public mapMarkerTextStyle = new PIXI.TextStyle({
        fontSize: 13,
        fontWeight: "normal",
        align: "center",
        fill: 0xffffff,
        lineHeight: 16,
        letterSpacing: 0.5,
        trim: true,
        wordWrap: true,
        wordWrapWidth: 150
    });

    /**
     * On Mounted.
	 * Similiar to the Map Page component, the mounted function runs once the component
	 * has been added to the page. 
	 * Here is where I set up the WebGL renderer using Pixi.js
     */
    public async mounted() {
        
        // Firstly, create the PIXI.js application. 
		// This created a WebGL context, which is then added to the page.
		// It's wrapped in a Try Catch block because some older browsers
		// don't support WebGl. I have error handling for this.
        try {
            PIXI.utils.skipHello();
            this.pixiApp = new PIXI.Application({
                width: this.mapRendererCanvasWrapper.offsetWidth, 
                height: this.mapRendererCanvasWrapper.offsetHeight,
                antialias: true,  
                transparent: true, 
                resolution: 1,
            });
            this.mapRendererCanvasWrapper.appendChild(this.pixiApp.view);
        } catch (err) {
            console.warn(err);
            this.$emit('pixi-error', err);
            return;
        }

        // Now I need to load the assets, which are basically small images used for rendering (show in folder)
		// Pixi.js has a built in asset loader, I just pass through the path to the assets,
		// and then listen for the load callback, which means they're ready to be used.
        this.pixiApp.loader.reset();
        this.pixiApp.loader.add([
            { name:'mapImage', url: this.mapImage },
            { name: 'mapMarker', url: require('../assets/map-marker-white-border.png') },
            { name: 'mapMarkerAvailable', url: require('../assets/map-marker-available.png') },
            { name: 'mapMarkerUnavailable', url: require('../assets/map-marker-unavailable.png') }
        ]).load(async () => {
            
            // I now utilise the Pixi Viewport library, which
			// helps with panning and zooming functionality. 
			// It's configured to take on the size of the map image.
            this.pixiViewport = new Viewport({
                screenWidth: this.mapRendererCanvasWrapper.offsetWidth,
                screenHeight: this.mapRendererCanvasWrapper.offsetHeight,
                worldWidth: this.pixiApp.loader.resources["mapImage"].texture.orig.width,
                worldHeight: this.pixiApp.loader.resources["mapImage"].texture.orig.height,
                interaction: this.pixiApp.renderer.plugins.interaction
            });
            
            // Resize marker depending on canvas size (smaller for mobile devices).
			// On smaller devices map markers can be close together and look slightly clustered.
			// I like to keep tap targets as large as possible for accessibility purposes,
			// therefore I didn't allow map markers to be rendered smaller than 28px.
            var sizeOfCanvas = this.mapRendererCanvasWrapper.offsetWidth;
            if (this.mapRendererCanvasWrapper.offsetWidth < this.mapRendererCanvasWrapper.offsetHeight) {
                sizeOfCanvas = this.mapRendererCanvasWrapper.offsetHeight;
            }
            if (sizeOfCanvas >= 992) {
                this.mapMarkerSize = 36;
                this.minZoomMultiplyer = 1.0;
				this.mapMarkerTextStyle.fontSize = 14;
            } else if (sizeOfCanvas < 992 && sizeOfCanvas >= 768) {
                this.mapMarkerSize = 32;
                this.minZoomMultiplyer = 1.1;
                this.mapMarkerTextStyle.fontSize = 13;
            } else if (sizeOfCanvas < 768) {
                this.mapMarkerSize = 28;;
                this.minZoomMultiplyer = 1.3;
                this.mapMarkerTextStyle.fontSize = 12;
            }
            
            // Next, I had to initiate the interaction plugins.
			// Pixi viewport was configured to allow for touch and mouse events.
            this.pixiViewport.drag();
            this.pixiViewport.pinch();
            this.pixiViewport.wheel();
            this.pixiViewport.decelerate({ friction: 0.94 });

			// The clamp function stops users from being able to pan the map
			// outside of the bounds. The bounds are set to the size of the map image.
            this.pixiViewport.clamp({ 
                left: -0, 
                right: this.pixiApp.loader.resources["mapImage"].texture.orig.width, 
                top: -0, 
                bottom: this.pixiApp.loader.resources["mapImage"].texture.orig.height
            });

			// Next, the clampZoom function stops the map from being zoomed out too far
			// or zoomed in too close.
            this.pixiViewport.clampZoom({ 
                maxWidth: this.pixiApp.loader.resources["mapImage"].texture.orig.width / this.minZoomMultiplyer, 
                maxHeight: this.pixiApp.loader.resources["mapImage"].texture.orig.height / this.minZoomMultiplyer, 
                minWidth: this.pixiApp.loader.resources["mapImage"].texture.orig.width / 5, 
                minHeight: this.pixiApp.loader.resources["mapImage"].texture.orig.height / 5 
            });
            this.pixiViewport.sortableChildren = true;

    
            // add the viewport to the PIXI.js stage
            this.pixiApp.stage.addChild(this.pixiViewport);

            // Now I utilise the PIXI.Sprite class to create a renderable sprite
			// out of the map image. I add it to the Pixi viewport instance, 
			// which means it gets rendered to the screen. 
            const mapSprite = this.pixiViewport.addChild(new PIXI.Sprite(this.pixiApp.loader.resources["mapImage"].texture))
            mapSprite.width = this.pixiApp.loader.resources["mapImage"].texture.orig.width;
            mapSprite.height = this.pixiApp.loader.resources["mapImage"].texture.orig.height;
            mapSprite.interactive = true;

            // When user mousedowns on the map, record the mouse position.
            var mousePositionDown = {x:0, y:0}
            mapSprite.on('mousedown', (e : Event) => {
                mousePositionDown = { x: this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, y: this.pixiApp.renderer.plugins.interaction.eventData.data.global.y };
            }).on('touchstart', (e : Event) => {
                mousePositionDown = { x: this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, y: this.pixiApp.renderer.plugins.interaction.eventData.data.global.y };
            });
            
            // Attach mouseup and touchend events to the map sprite.
			// When user mouseups on the map, calculate the distance 
            // that the mouse has moved from the mousedown event. 
            // This prevents the user accicdentally unselecting a map marker
            // when panning the map.
            mapSprite.on('mouseup', (e : Event) => {
                if (Math.hypot(mousePositionDown.x - this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, mousePositionDown.y - this.pixiApp.renderer.plugins.interaction.eventData.data.global.y) < 5) {
                    this.$emit('marker-select', null);
                }
            }).on('touchend', (e : Event) => {
                if (Math.hypot(mousePositionDown.x - this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, mousePositionDown.y - this.pixiApp.renderer.plugins.interaction.eventData.data.global.y) < 5) {
                    this.$emit('marker-select', null);
                }
            });

            // Listen to the moved event while scrolling
            // the mouse wheel. And if so then rescale
            // all the map markers                
            this.pixiViewport.on('zoomed', throttle(this.handleZoom, 50));

			// Enable culling
			this.pixiCull = new Cull.Simple();
			this.pixiCull.addList(this.pixiViewport.children);
			this.pixiCull.cull(this.pixiViewport.getVisibleBounds());

			// cull whenever the viewport moves
			this.pixiApp.ticker.add(() => {
				if (this.pixiViewport.dirty) {
					this.pixiCull.cull(this.pixiViewport.getVisibleBounds());
					this.pixiViewport.dirty = false;
				}
			});

            // Update watchers
            this.updateWatchers();

            // Start at min zoom
            if (this.mapRendererCanvasWrapper.offsetHeight < this.mapRendererCanvasWrapper.offsetWidth) {
                this.pixiViewport.setZoom(this.mapRendererCanvasWrapper.offsetHeight / this.pixiApp.loader.resources["mapImage"].texture.orig.height, true)
            } else {
                this.pixiViewport.setZoom(this.mapRendererCanvasWrapper.offsetWidth / this.pixiApp.loader.resources["mapImage"].texture.orig.width, true)
            } 

            // The map is now ready to be shown to the end user.
			// Emit the ready event, which can be listened to
			// from the MapPage component. 
            this.$emit('ready');

			// Is disabled?
			this.onDisabledChange(this.disabled);

            // Is now ready
            this.ready = true;

        });


    }

    /**
     * On beforeDestroy hook
     */
    public beforeDestroy() {
        if (this.pixiViewport) {
            this.pixiViewport.destroy();
        }
        if (this.pixiApp) {
            this.pixiApp.loader.reset();
            this.pixiApp.destroy(true, {
                children: true,
                texture: true,
                baseTexture: true,
            });
            PIXI.utils.destroyTextureCache();
        }
        window.cancelAnimationFrame(this.renderLoopId);
    }

    /**
     * Create a sprite
     */
    private createMapMarkerSprite(mapMarker: MapMarkerEditor) {

        // Create container, similiar to a DIV element.
		// the name property is basically a unique ID
        const container = new PIXI.Container();
        container.name = mapMarker.mapMarkerId;

        // Next, the text sprite is created. This is what appears
		// above the map marker, based on the map marker title
		// which is configured in the back office. 
		// Before rendering the text, it has to be measured.
		// There is no relative positioning like CSS, therefore
		// the text has to be positioned manually above the map marker.
        const textSprite = new PIXI.Text(mapMarker.mapMarkerTitle, this.mapMarkerTextStyle);
        const textSize = PIXI.TextMetrics.measureText(mapMarker.mapMarkerTitle, this.mapMarkerTextStyle);
        textSprite.resolution = 2;  
        textSprite.position.set(0, 0);
        textSprite.anchor.set(0.5, 0);
        textSprite.renderable = mapMarker.mapMarkerTitleDisplayType !== 'never' ? true : false;

		// The text is displayed within a black box. 
		// I beleive this made it easier to read. 
        const textBgSprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
		textBgSprite.position.set(0, -4);
		textBgSprite.height = textSize.height + 2;
		textBgSprite.width = textSize.width + 6;
        textBgSprite.anchor.set(0.5, 0);
		textBgSprite.tint = 0x212121;
        textSprite.renderable = mapMarker.mapMarkerTitleDisplayType !== 'never' ? true : false;

        // Create map marker sprite.
		// Next, the actual map marker sprite is created. 
        const mapMarkerSprite = new PIXI.Sprite(this.pixiApp.loader.resources["mapMarker"].texture);
        mapMarkerSprite.anchor.set(0.5, 0);
        mapMarkerSprite.position.set(0, mapMarker.mapMarkerTitleDisplayType !== 'never' ? (textBgSprite.height + 2) : 0);
        mapMarkerSprite.height = this.mapMarkerSize;
        mapMarkerSprite.width = this.mapMarkerSize;
        mapMarkerSprite.interactive = true;
        mapMarkerSprite.cursor = "pointer";

		// Attach events to the map marker sprite,
		// which emits the corresponding events.
        mapMarkerSprite.on('click', (e : Event) => { this.$emit('marker-select', mapMarker.mapMarkerId); });
        mapMarkerSprite.on('tap', (e : Event) => { this.$emit('marker-select', mapMarker.mapMarkerId); });
        mapMarkerSprite.on('mouseover', (e : Event) => { this.$emit('marker-hover', mapMarker.mapMarkerId); });
        mapMarkerSprite.on('mouseout', (e : Event) => { this.$emit('marker-unhover', mapMarker.mapMarkerId); });

        // Now, since the map marker sprite is originally white,
		// the colour has to be changed to represent what key it's assigned to.
		// Once the colour of the corresponding key is found, the 'tint' property
		// on the sprite simply makes any white pixels rendered to the provided colour.
		// You can see that if this marker has a key assigned, the tint it set to the key colour,
		// else it defaults to a reddish colour.
        const key = this.getKeyById(mapMarker.mapMarkerKey);
        mapMarkerSprite.tint = key ? parseInt("0x" + key.mapKeyColor) : parseInt("0x" + "dc3545");

		// Now add all the indiviual sprites to the container
		container.addChild(textBgSprite);
        container.addChild(textSprite);
        container.addChild(mapMarkerSprite);

		// Now the containers position is set based on the configurations set
		// in the back office. 
        container.position.set(mapMarker.mapMarkerPositionX, mapMarker.mapMarkerPositionY - container.height);

        // Return the container
        return container;
    }

    /**
     * Update a map marker sprite
     */
    private updateMapMarkerSprite(mapMarker: MapMarkerEditor) {

		// Get container sprite
        const container = this.getMapMarkerSprite(mapMarker.mapMarkerId);

		// If container sprite doesn't exist return
		if (!container) 
			return;
			
		// Reference sprites
		const textBgSprite = container.children[0] as PIXI.Sprite;
		const textSprite = container.children[1] as PIXI.Text;
		const markerSprite = container.children[2] as PIXI.Sprite;

		// Set title text visibility
		if (mapMarker.mapMarkerTitleDisplayType === "always") {
			textSprite.alpha = 1;
			textBgSprite.alpha = 1;
		} else if (mapMarker.mapMarkerTitleDisplayType === "hover") {
			textSprite.alpha = mapMarker.mapMarkerHovered ? 1: 0;
			textBgSprite.alpha = mapMarker.mapMarkerHovered ? 1 : 0;
		}

		// Availability checking
		if (mapMarker.mapMarkerState === "default") {
			markerSprite.texture = this.pixiApp.loader.resources["mapMarker"].texture;
			markerSprite.interactive = true;
			container.alpha = 1;
		} else if (mapMarker.mapMarkerState === "available") {
			markerSprite.texture = this.pixiApp.loader.resources["mapMarkerAvailable"].texture;
			markerSprite.interactive = true;
			container.alpha = 1;
		} else if (mapMarker.mapMarkerState === "unavailable") {
			markerSprite.texture = this.pixiApp.loader.resources["mapMarkerUnavailable"].texture;
			markerSprite.interactive = false;
			container.alpha = 0.7;
		} else if (mapMarker.mapMarkerState === "not_a_pitched_unit") {
			markerSprite.texture = this.pixiApp.loader.resources["mapMarker"].texture;
			markerSprite.interactive = false;
			container.alpha = 0.7;
		}

		// Bring selected or hovered map markers to front
		if (mapMarker.mapMarkerSelected) {
			container.zIndex = 1000;
		} else {
			if (!mapMarker.mapMarkerHovered) {
				container.zIndex = 1;
			} else {
				container.zIndex = 1001;
			}
		}

		// Set container scale and positioning
		container.scale.set(1 / this.pixiViewport.scaled);
		container.position.set(mapMarker.mapMarkerPositionX, mapMarker.mapMarkerPositionY - container.height);

		// Allow items to be rendered on top
		this.pixiViewport.updateTransform();

    }
	
    /**
     * Delete a map marker sprite
     */
    private deleteMapMarkerSprite(mapMarkerId: string) {
        var sprite = this.getMapMarkerSprite(mapMarkerId);
        if (sprite) {
            var index = this.pixiMapMarkerSprites.indexOf(sprite);
            if (index !== -1) {
				var textBgSprite = sprite.children[0] as PIXI.Sprite;
				var textSprite = sprite.children[1] as PIXI.Text;
				var markerSprite = sprite.children[2] as PIXI.Sprite;
				textBgSprite.destroy();
				textSprite.destroy();
				markerSprite.destroy();
                this.pixiMapMarkerSprites.splice(index, 1);
            }
            sprite.destroy();
        }
    }


    /**
     * Get the sprite for a specific map marker
     */
    private getMapMarkerSprite(mapMarkerId : string) {
		for (let i = 0; i < this.pixiMapMarkerSprites.length; i++)  {
			if (this.pixiMapMarkerSprites[i].name === mapMarkerId)
				return this.pixiMapMarkerSprites[i];
        }
		return null;
    }

    /**
     * Get map key by id
     */
    private getKeyById(keyId: string) {
        return this.keys.find((k) => {
            return k.mapKeyId === keyId;
        });
    }

    /**
     * Vue automatically watches variables, but 
	 * does not watch nested objects. Therefore,
	 * I had to create my own watching functionality. 
     */
    private updateWatchers () {

        // Helper function for comparing list items to the "watchTracker".
        const getItem = (val : any) => val.item || val;

		// This differenceBy function is provided by loadash,
		// it basically allows me to perform a function whenever
		// a new map marker needs to be rendered. 
        // Items that aren't already watched: watch and add to watched list.
        differenceBy(this.markers, this.watchTracker, getItem).forEach((item : MapMarkerEditor) => {

			// Create the watcher for this map marker,
			// using the $watch function provided by Vue.
			// Keep a reference of it.
            const watcher = this.$watch(() => item, this.updateMapMarkerSprite, {deep: true});

			// Push new map marker and it's watcher reference to watch tracker
            this.watchTracker.push({ item: item, unwatch: watcher });

            // Now the new sprite can be created. The function returns the sprite
			// that needs to be added to the viewport.
            var sprite = this.createMapMarkerSprite(item);
            this.pixiMapMarkerSprites.push(sprite);
            this.pixiViewport.addChild(sprite);
            this.updateMapMarkerSprite(item);
			this.pixiCull.addList(this.pixiViewport.children);

        });

        // This bit of code is similiar to the code above, but detects
		// when map markers should no longer be rendered, and should
		// therefore be removed from the viewport.
        differenceBy(this.watchTracker, this.markers, getItem).forEach((watchObj : any) => {

            // Remove the sprite from the viewport and memory
            this.deleteMapMarkerSprite(watchObj.item.mapMarkerId);
            pull(this.watchTracker, watchObj);
			this.pixiCull.addList(this.pixiViewport.children);

        });
    }

	/**
	 * Update render loop
	 */
    public handleRenderLoopUpdate(time : number) {
		
        requestAnimationFrame(this.handleRenderLoopUpdate);
    }

    /**
     * Handle zoom
     */
    public handleZoom(data : any) {
        for (let i = 0; i < this.markers.length; i++)  {
            this.updateMapMarkerSprite(this.markers[i]);
        }
    }

    /**
     * Watch disabled prop
     */
    @Watch('disabled')
    public onDisabledChange(val: boolean) {
        if (val) {
            this.pixiViewport.plugins.pause('wheel')
            this.pixiViewport.plugins.pause('drag')
            this.pixiViewport.plugins.pause('pinch')
        } else {
            this.pixiViewport.plugins.resume('wheel')
            this.pixiViewport.plugins.resume('drag')
            this.pixiViewport.plugins.resume('pinch')
        }
    }
    
    /**
     * Watch markers array
     */
    @Watch('markers', { immediate: true, deep: true })
    public onMarkersChange(val: Array<MapMarkerEditor>) {
        if (!this.ready)
            return;
        return this.updateWatchers();
    }
    
    /**
     * Watch keys array
     */
    @Watch('keys', { immediate: true, deep: true })
    public onKeysChange(val: Array<MapMarkerEditor>) {
        if (!this.ready)
            return;
        this.markers.forEach((m) => {
            this.updateMapMarkerSprite(m);
        });
    }

}

</script>


<style lang="scss">
    
    @import '../scss/variables.scss';

    .map-renderer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

</style>