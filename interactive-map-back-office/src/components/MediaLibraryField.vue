<template>
    <div class="media-library-field">
        <div class="media-library-field-img"></div>
        <div class="media-library-field-placeholder">Media Library</div>
        <b-button 
            :disabled="disabled"
            v-on:click="modalOpen = true"
            variant="link" 
            class="media-library-field-open-gallery-btn" size="sm">
            Open
        </b-button>
        <div class="media-library-field-images" v-if="mutableSelected.length > 0">
            <div 
                class="media-library-field-image"
                v-for="image in mutableSelected"
                v-bind:key="image.imageId"
                :style="`background-image:url(${image.imagePathThumbnail})`">
            </div>
        </div>
        <modal :open.sync="modalOpen" :modalDissmissible="true" :width="1000">
            <template v-slot:content>
                <media-library 
                    :multi-select="mutableMultiSelect"
                    :uploadable="mutableUpload"
                    :selected="mutableSelected.map((s) => { return s.imageId })"
                    v-on:select="onMediaLibraryImageSelect" 
                />
            </template>
        </modal>

    </div>
</template>

<script lang="ts">
import ImageClient from '@/models/ImageModels/Image.client';
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';
import { PropType } from 'vue';
import clone from 'lodash.clone';

@Component({})
export default class MediaLibraryField extends Vue {

    @Prop({ type: Boolean, default: false }) public readonly disabled!: boolean
    @Prop({ type: Boolean, default: true }) public readonly upload!: boolean
    @Prop({ type: Boolean, default: false }) public readonly multiSelect!: boolean
    @Prop({ type: Array as PropType<Array<string>>, default: () => [] }) public readonly selected!: Array<ImageClient>

    public mutableUpload = this.upload;
    public mutableMultiSelect = this.multiSelect;
    public mutableSelected = clone(this.selected);

    public modalOpen = false;
    public modalDissmissible = true;
    public selectedImages: ImageClient[] = [];


    public onMediaLibraryImageSelect (imageIds: string[], imageClients: ImageClient[]) {
        this.mutableSelected = clone(imageClients);
    }

    @Watch('modalOpen')
    public modalOpenWatcher(val: boolean) {
        if (!val) {
            this.$emit('change', this.mutableSelected);
        }
    }
    
    @Watch('selected')
    public selectedWatcher(val: Array<ImageClient>) {
        this.mutableSelected = val;
    }
}

</script>
<style lang="scss" >

@import '../scss/variables.scss';

.media-library-field {
    position: relative;
    display: block;
    width: 100%;
    padding: 3px;
    border-radius: 0.2rem;
    border: 1px solid #ced4da;
    font-size: 0;
    
    .media-library-field-placeholder {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: calc(100% - 0px - 60px);
        height: 100%;
        line-height: 28px;
        padding: 0 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
    }

    .media-library-field-open-gallery-btn {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 60px;
        padding: 0!important;
        height: 100%!important;
        line-height: 28px!important;
        box-sizing: border-box;
        border-left: 1px solid #ced4da;
        border-radius: 0px;
    }

    .media-library-field-images {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        padding-top: 3px;
        margin-top: 3px;
        border-top: 1px solid #ced4da;

        .media-library-field-image  {
            position: relative;
            display: inline-block;
            vertical-align: top;
            width: calc(100% / 4);
            height: 36px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            border: 1px solid #fff;

        }
    }
}

</style>
