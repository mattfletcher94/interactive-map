<template>
<div
    class="d-block h-100">
    <div
        class="d-block overflow-auto h-100">
        <div
            class="d-block p-4"
            style="max-width: 1000px">
			<div class="row">
				<div 
					class="col-12 col-md-6 col-lg-4 mb-4"
					v-for="item in maps"
                    v-bind:key="item._id">
					<map-card
                        :map-title="item.mapTitle"
                        :map-id="item.mapId"
                        :map-image="item.mapImage ? item.mapImage.imagePath : ''" />
				</div>
			</div>
        </div>
    </div>
    <overlay-loader
        message="Loading maps..."
        :show.sync="requestMapsLoading"
        :opacity="0.9" />
    <b-button
        id="create-map-btn"
        to="/dashboard/maps/create"
        pill
        variant="primary">
        <i class="fas fa-plus mr-2"></i> Create Map
    </b-button>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RepositoryFactory from "@/repositories/RepositoryFactory";
import MapClient from '@/models/MapModels/Map.client';

@Component({})
export default class DashboardPageMapsPage extends Vue {

    /**
     * Array of maps
     */
    public maps: Array<MapClient> = [];

    /**
     * Are maps currently loading?
     */
    public requestMapsLoading = false;

    /**
     * Mounted hook
     */
    public async mounted() {
        await this.getMaps();
    }

    public async getMaps() {
        this.requestMapsLoading = true;
        const repo = new RepositoryFactory().getMapsRepository();
        const resp = await repo.get();
        if (resp.is200) {
            this.maps = resp.is200.data;
        }
        this.requestMapsLoading = false;
    }

}
</script>
<style lang="scss" >
    #create-map-btn {
        position: absolute;
        bottom: 24px;
        right: 24px;
        z-index: 999;
        padding: 12px 30px;
        border: none;
        box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 rgb(0 0 0 / 12%);
    }
</style>
