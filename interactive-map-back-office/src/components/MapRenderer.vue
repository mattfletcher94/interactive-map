<template>
    <div 
        class="map-renderer" 
        ref="mapRendererCanvasWrapper"
        v-on:mouseup="onCanvasMouseUp"
    ></div>
</template>

<script lang="ts">
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport'
import { Component, Prop, Ref, Vue, Watch, } from 'vue-property-decorator';
import { PropType } from 'vue';
import MapClient from '@/models/MapModels/Map.client';
import MapMarkerEditor from '@/models/MapMarkerModels/MapMarker.editor';
import MapKeyEditor from '@/models/MapKeyModels/MapKey.editor';
import differenceBy from 'lodash.differenceby';
import pull from 'lodash.pull';

@Component({ })
export default class MapRenderer extends Vue {

    /**
     * Reference elements
     */
    @Ref('mapRendererCanvasWrapper') readonly mapRendererCanvasWrapper!: HTMLElement;

    /**
     * Register map prop
     */
    @Prop({ type: MapClient, default: new MapClient() }) public readonly map!: MapClient

    /**
     * Register map markers
     */
    @Prop({ type: Array as PropType<Array<MapMarkerEditor>>, default: () => [] }) public readonly markers!: Array<MapMarkerEditor>

    /**
     * Register map keys
     */
    @Prop({ type: Array as PropType<Array<MapKeyEditor>>, default: () => [] }) public readonly keys!: Array<MapKeyEditor>

    /**
     * Reference the pixi application
     */
    public pixiApp!: PIXI.Application;

    /**
     * Reference the pixi viewport
     */
    public pixiViewport!: Viewport;

    /**
     * An array of sprites to render
     */
    public pixiMapMarkerSprites: Array<PIXI.Container> = []
    public pixiMapMarkerTextSprites: Array<PIXI.Sprite> = []
    

    /**
     * Track watchers
     */
    public watchTracker: any[] = [];

    /**
     * Is the map ready?
     */
    public ready = false;

    /**
     * Map marker size
     */
    public mapMarkerSize = 36;

    /**
     * Multiplyer for min zoom
     */
    public minZoomMultiplyer = 1;

    /**
     * Define text style
     */
    public mapMarkerTextStyle = new PIXI.TextStyle({
        fontSize: 14,
        fontWeight: "normal",
        align: "center",
        fill: 0xffffff,
        lineHeight: 16,
        lineJoin: "round",
        stroke: 0x000000,
	    strokeThickness: 3,
        trim: true,
        wordWrap: true,
        wordWrapWidth: 150
    });

    /**
     * Mounted hook
     */
    public async mounted() {

        // Create PIXI.js instance
        PIXI.utils.skipHello();
        this.pixiApp = new PIXI.Application({
            width: this.mapRendererCanvasWrapper.offsetWidth, 
            height: this.mapRendererCanvasWrapper.offsetHeight,
            antialias: true,  
            transparent: true, 
            resolution: 1,
        });
        this.mapRendererCanvasWrapper.appendChild(this.pixiApp.view);

        // load assets for pixi
        this.pixiApp.loader.reset();
        this.pixiApp.loader.add([
            { name:'mapImage', url: this.map?.mapImage?.imagePath },
            { name: 'mapMarker', url: require('../assets/map-marker-white-border.png') }
        ]).load(async () => {

            // Calcualte world size
            let worldSize = { w: 0, h: 0 }
            if (this.pixiApp.loader.resources["mapImage"].texture.orig.height > this.pixiApp.loader.resources["mapImage"].texture.orig.width) {
                worldSize = {
                    w: 2000,
                    h: 2000 * (this.pixiApp.loader.resources["mapImage"].texture.orig.height / this.pixiApp.loader.resources["mapImage"].texture.orig.width)
                }
            } else {
                worldSize = {
                    w: 2000 * (this.pixiApp.loader.resources["mapImage"].texture.orig.width / this.pixiApp.loader.resources["mapImage"].texture.orig.height),
                    h: 2000 
                }
            }

            
            // Create viewport 
            this.pixiViewport = new Viewport({
                screenWidth: this.mapRendererCanvasWrapper.offsetWidth,
                screenHeight: this.mapRendererCanvasWrapper.offsetHeight,
                worldWidth: this.pixiApp.loader.resources["mapImage"].texture.orig.width,
                worldHeight: this.pixiApp.loader.resources["mapImage"].texture.orig.height,
                interaction: this.pixiApp.renderer.plugins.interaction
            });

            // Resize marker depending on canvas size (smaller for mobile devices)
            let sizeOfCanvas = this.mapRendererCanvasWrapper.offsetWidth;
            if (this.mapRendererCanvasWrapper.offsetWidth < this.mapRendererCanvasWrapper.offsetHeight) {
                sizeOfCanvas = this.mapRendererCanvasWrapper.offsetHeight;
            }
            if (sizeOfCanvas >= 992) {
                this.mapMarkerSize = 36;
                this.minZoomMultiplyer = 1.0;
                this.mapMarkerTextStyle.fontSize = 14;
            } else if (sizeOfCanvas < 992 && sizeOfCanvas >= 768) {
                this.mapMarkerSize = 32;
                this.minZoomMultiplyer = 1.0;
                this.mapMarkerTextStyle.fontSize = 14;
            } else if (sizeOfCanvas < 768) {
                this.mapMarkerSize = 28;
                this.minZoomMultiplyer = 1.0;
                this.mapMarkerTextStyle.fontSize = 14;
            }

            // Add plugins for boundaries
            this.pixiViewport.drag();
            this.pixiViewport.pinch();
            this.pixiViewport.wheel();
            this.pixiViewport.decelerate({ friction: 0.94 });
            this.pixiViewport.clamp({ 
                left: -0, 
                right: this.pixiApp.loader.resources["mapImage"].texture.orig.width, 
                top: -0, 
                bottom: this.pixiApp.loader.resources["mapImage"].texture.orig.height 
            });
            this.pixiViewport.clampZoom({ 
                maxWidth: this.pixiApp.loader.resources["mapImage"].texture.orig.width / this.minZoomMultiplyer, 
                maxHeight: this.pixiApp.loader.resources["mapImage"].texture.orig.height / this.minZoomMultiplyer, 
                minWidth: this.pixiApp.loader.resources["mapImage"].texture.orig.width / 5, 
                minHeight: this.pixiApp.loader.resources["mapImage"].texture.orig.height / 5 
            });
            this.pixiViewport.sortableChildren = true;
    
            // add the viewport to the PIXI.js stage
            this.pixiApp.stage.addChild(this.pixiViewport);

            // Add the map image to the renderer
            const mapSprite = this.pixiViewport.addChild(new PIXI.Sprite(this.pixiApp.loader.resources["mapImage"].texture))
            mapSprite.width = this.pixiApp.loader.resources["mapImage"].texture.orig.width;
            mapSprite.height = this.pixiApp.loader.resources["mapImage"].texture.orig.height;
            mapSprite.interactive = true;

            // When user mousedowns on the map, record the mouse position.
            let mousePositionDown = {x:0, y:0}
            mapSprite.on('mousedown', (e: Event) => {
                mousePositionDown = { x: this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, y: this.pixiApp.renderer.plugins.interaction.eventData.data.global.y };
            }).on('touchstart', (e: Event) => {
                mousePositionDown = { x: this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, y: this.pixiApp.renderer.plugins.interaction.eventData.data.global.y };
            });
            
            // When user mouseups on the map, calculate the distance 
            // that the mouse has moved from the mousedown event. 
            // This prevents the user accicdentally unselecting a map marker
            // when panning the map
            mapSprite.on('mouseup', (e: Event) => {
                if (Math.hypot(mousePositionDown.x - this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, mousePositionDown.y - this.pixiApp.renderer.plugins.interaction.eventData.data.global.y) < 5) {
                    this.$emit('marker-select', null);
                }
            }).on('touchend', (e: Event) => {
                if (Math.hypot(mousePositionDown.x - this.pixiApp.renderer.plugins.interaction.eventData.data.global.x, mousePositionDown.y - this.pixiApp.renderer.plugins.interaction.eventData.data.global.y) < 5) {
                    this.$emit('marker-select', null);
                }
            });

            // Listen to the moved event while scrolling
            // the mouse wheel. And if so then rescale
            // all the map markers                
            this.pixiViewport.on('zoomed', (data) => {
                for (let i = 0; i < this.markers.length; i++)  {
                    this.updateMapMarkerSprite(this.markers[i]);
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

            // Update all markers 
            for (let i = 0; i < this.markers.length; i++)  {
                this.updateMapMarkerSprite(this.markers[i]);
            }

            // Is no longer loading
            this.$emit('ready');

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
    }

    /**
     * handle mouseup event
     */
    public onCanvasMouseUp() {
        const position = this.pixiViewport.toWorld(this.pixiApp.renderer.plugins.interaction.mouse.global.x, this.pixiApp.renderer.plugins.interaction.mouse.global.y);
        this.$emit('mouseup', position);
    }

    /**
     * Create a sprite
     */
    private createMapMarkerSprite(mapMarker: MapMarkerEditor) {

        // Create container
        const container = new PIXI.Container();
        container.name = mapMarker.mapMarkerId;

        // Create text sprite
        const textSprite = new PIXI.Text(mapMarker.mapMarkerTitle, this.mapMarkerTextStyle);
        const textSize = PIXI.TextMetrics.measureText(mapMarker.mapMarkerTitle, this.mapMarkerTextStyle);
        textSprite.resolution = 2;  
        textSprite.name = "title";
        textSprite.position.set(0, 2);
        textSprite.anchor.set(0.5, 0);
        textSprite.name = mapMarker.mapMarkerId;
        textSprite.alpha = mapMarker.mapMarkerTitleDisplayType === "always" ? 1 : 0;
        container.addChild(textSprite)

        // Create map marker sprite
        const mapMarkerSprite = new PIXI.Sprite(this.pixiApp.loader.resources["mapMarker"].texture);
        mapMarkerSprite.name = "marker";
        mapMarkerSprite.anchor.set(0.5, 0);
        mapMarkerSprite.position.set(0, textSize.height + 2);
        mapMarkerSprite.height = this.mapMarkerSize;
        mapMarkerSprite.width = this.mapMarkerSize;
        mapMarkerSprite.interactive = true;
        mapMarkerSprite.cursor = "pointer";
        mapMarkerSprite.on('click', (e: Event) => {
            this.$emit('marker-select', mapMarker.mapMarkerId);
        });
        mapMarkerSprite.on('tap', (e: Event) => {
            this.$emit('marker-select', mapMarker.mapMarkerId);
        });
        mapMarkerSprite.on('mouseover', (e: Event) => {
            this.$emit('marker-hover', mapMarker.mapMarkerId);
        });
        mapMarkerSprite.on('mouseout', (e: Event) => {
            this.$emit('marker-unhover', mapMarker.mapMarkerId);
        });
        container.addChild(mapMarkerSprite);

        // Set map marker sprite color based on key
        const key = this.getKeyById(mapMarker.mapMarkerKey);
        mapMarkerSprite.tint = key ? parseInt("0x" + key.mapKeyColor) : parseInt("0x" + "dc3545");

        // Set container position now everything has been added
        container.position.set(mapMarker.mapMarkerPositionX, mapMarker.mapMarkerPositionY - container.height);

        // Return the container
        return container;
    }

    /**
     * Update a map marker sprite
     */
    private updateMapMarkerSprite(mapMarker: MapMarkerEditor) {
        const container = this.getMapMarkerSprite(mapMarker.mapMarkerId);
        if (container) {
            
            // Set map marker sprite color based on key
            const markerSprite = container.getChildByName("marker") as PIXI.Sprite;
            const key = this.getKeyById(mapMarker.mapMarkerKey);
            markerSprite.tint = key ? parseInt("0x" + key.mapKeyColor) : parseInt("0x" + "dc3545");

            // Update title text, and display correctly
            // based on display type
            const textSprite = container.children[0] as PIXI.Text;
            textSprite.text = mapMarker.mapMarkerTitle;
            if (mapMarker.mapMarkerTitleDisplayType === "always") {
                textSprite.alpha = 1;
            } else if (mapMarker.mapMarkerTitleDisplayType === 'hover') {
                if (mapMarker.mapMarkerHovered) {
                    container.zIndex = 1001;
                    textSprite.alpha = 1;
                } else {
                    container.zIndex = 1;
                    textSprite.alpha = 0;
                }
            } else {
                textSprite.alpha = 0;
            }

            // Calculate new size of text
            const textSize = PIXI.TextMetrics.measureText(mapMarker.mapMarkerTitle, this.mapMarkerTextStyle);

            // Update marker position
            markerSprite.position.set(0, textSize.height + 2);

            // Set container position
            container.scale.set(1 / this.pixiViewport.scaled);
            container.position.set(mapMarker.mapMarkerPositionX, mapMarker.mapMarkerPositionY - container.height);

            // Bring selected marker to front
            if (mapMarker.mapMarkerSelected) {
                container.zIndex = 1000;
            } else {
                if (!mapMarker.mapMarkerHovered) {
                    container.zIndex = 1;
                }
            }

            // Allow items to be rendered on top
            this.pixiViewport.updateTransform();

        }
    }

    /**
     * Delete a map marker sprite
     */
    private deleteMapMarkerSprite(mapMarkerId: string) {
        const sprite = this.getMapMarkerSprite(mapMarkerId);
        if (sprite) {
            const index = this.pixiMapMarkerSprites.indexOf(sprite);
            if (index !== -1) {
                this.pixiMapMarkerSprites.splice(index, 1);
            }
            sprite.destroy();
        }
    }

    /**
     * Get the sprite for a specific map marker
     */
    private getMapMarkerSprite(mapMarkerId: string) {
        return this.pixiMapMarkerSprites.find((s) => {
            return s.name === mapMarkerId;
        });
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
     * Handle watchers for markers
     */
    private updateWatchers () {

        // Helper function for comparing list items to the "watchTracker".
        const getItem = (val: any) => val.item || val;

        // Items that aren't already watched: watch and add to watched list.
        differenceBy(this.markers, this.watchTracker, getItem).forEach((item: any) => {
            const unwatch = this.$watch(() => item, this.updateMapMarkerSprite, {deep: true});
            this.watchTracker.push({ item: item, unwatch: unwatch });

            // CREATE NEW SPRITE
            const sprite = this.createMapMarkerSprite(item);
            this.pixiMapMarkerSprites.push(sprite);
            this.pixiViewport.addChild(sprite);
            this.updateMapMarkerSprite(item);

        });

        // Items that no longer exist: unwatch and remove from the watched list.
        differenceBy(this.watchTracker, this.markers, getItem).forEach((watchObj: any) => {

            // REMOVE SPRITE
            this.deleteMapMarkerSprite(watchObj.item.mapMarkerId);

            pull(this.watchTracker, watchObj);

        });

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