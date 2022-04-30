<template>
<div
    class="d-block h-100">
    <div
        class="d-block overflow-auto h-100">
        <div
            class="d-block p-4 mx-auto"
            style="max-width: 1200px">
			<b-card>
				<b-card-body>
					<b-card-title>Create a map</b-card-title>
					<hr />
					<form-create-map 
                        v-bind:busy="formBusy"
                        v-bind:invalid-feedback="formFeedback"
                        v-on:success="onFormSuccess" 
                    />
				</b-card-body>
			</b-card>
        </div>
    </div>
</div>

</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import MapCreate from '@/models/MapModels/Map.create';
import RepositoryFactory from '@/repositories/RepositoryFactory';

@Component({ })
export default class DashboardPageCreateMapPage extends Vue {

    public formBusy = false;
    public formFeedback = "";

    public async onFormSuccess(form: MapCreate) {
        
        // Show loader
        this.formBusy = true;

        // Make API request
        const repo = new RepositoryFactory().getMapsRepository();
        const resp = await repo.create({
            mapTitle: form.mapTitle,
            mapDescription: form.mapDescription,
            mapImage: form.mapImage,
        })

        // If created successfully
        if (resp.is201) {
            this.$router.push('/dashboard/maps/');
        }

        // If unsuccessfull
        else if (resp.is400) {
            this.formFeedback = resp.is400.errors[0].message;
        }

        // Is no longer loading
        this.formBusy = false;
    }


}
</script>

<style lang="scss">
@import '../scss/variables.scss';

</style>
