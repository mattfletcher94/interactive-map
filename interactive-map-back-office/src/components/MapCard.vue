<template>
	<b-card 
		class="map-card p-0"
		no-body>
		<div class="map-card-top">
			<div class="map-card-image" :style="this.computedMapImage"></div>
		</div>
		<b-card-body>
			<b-card-title>{{ this.mapTitle }}</b-card-title>
			<hr />
            <b-button :to="'/dashboard/maps/edit/' + this.mapId" class="btn-flat btn-flat-primary">Edit Map</b-button>
		</b-card-body>
	</b-card>
	<!--
	<div class="map-card">
		<div class="map-card-top">
            <div class="map-card-image" :style="this.computedMapImage"></div>
            <i v-if="!this.mapImage" class="far fa-image placeholder"></i>
        </div>
        <div class="map-card-desc">
            <h5 class="map-card-title mb-1">{{ this.mapTitle }}</h5>
        </div>
        <div class="map-card-actions text-right">
            <b-button :to="'/dashboard/maps/edit/' + this.mapId" class="btn-flat btn-flat-primary">Edit Map</b-button>
        </div>
	</div>
	-->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';


@Component({})
export default class MapCard extends Vue {

    @Prop({ type: String, default: "" }) 
    public readonly mapId!: string

    @Prop({ type: String, default: "" }) 
    public readonly mapTitle!: string

    @Prop({ type: String, default: "" }) 
    public readonly mapImage!: string
  
    /**
     * Computed property for map image styling
     */
    get computedMapImage(): string {
        return `background-image: url(${ this.mapImage })`;
    }

}
</script>

<style  lang="scss">
@import '../scss/variables.scss';

.map-card {
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;
    background-color: #fff;

    .map-card-top {
        position: relative;
        display: block;
        width: 100%;
        height: 180px;

        &::before {
            content:"";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #e1e1e1;
        }

        .map-card-image {
            content:"";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
        }
    }

    .card-title {
		font-size: 1.25rem;
	}

}
</style>
