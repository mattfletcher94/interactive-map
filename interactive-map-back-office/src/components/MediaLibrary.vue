<template>
	<div class="media-library form-control" :class="classNames">

        <!-- title bar -->
        <div class="media-library-title-bar">
            <div class="row no-gutters">
                <div class="col-4 p-2 align-self-center">
		            <p class="m-0"><i class="fas fa-images mx-1"></i> Media Library</p>
                </div>
                <div class="col-8 p-2 align-self-center">
                    <div class="d-block text-right">
                        <b-form-input 
                            v-model="filterName"
                            :disabled="diabledSynced || mediaLibraryLoading"
                            type="text" 
                            placeholder="Search by name..."
                            size="sm"
                            class="d-inline-block mr-2 w-auto" />
                        <b-form-select 
                            v-model="filterSelection" 
                            :disabled="diabledSynced || mediaLibraryLoading" 
                            size="sm"
                            class="d-inline-block mr-2 w-auto">
                            <b-form-select-option :value="''">Show All</b-form-select-option>
                            <b-form-select-option value="selected">Show Selected</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
            </div>
        </div>

        
        <div class="row no-gutters">

            <!-- Content area -->
            <div :class="this.uploadable ? 'col-9' : 'col-12'">
                <div class="media-library-content">
                    <b-list-group class="media-library-list" horizontal="sm" v-if="mediaLibrary.length > 0">
                        <b-list-group-item 
                            class="media-library-list-item" 
                            :class="mutableSelected.includes(item.imageId) ? 'active' : ''" 
                            v-for="item in mediaLibraryFiltered"
                            v-bind:key="item.imageId">
                            <div class="img" :style="`background-image:url(${item.imagePathThumbnail})`"></div>
                            <div class="active-checkbox" v-on:click="selectImage(item.imageId)">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="caption" v-if="item.imageName">{{ item.imageName }}</div>
                            <b-dropdown class="img-dropdown" variant="link" no-caret lazy>
                                <template #button-content>
                                    <i class="fas fa-trash"></i>
                                </template>
                                <b-dropdown-item-button v-on:click="deleteImage(item.imageId)">Delete</b-dropdown-item-button>
                            </b-dropdown>
                        </b-list-group-item>
                    </b-list-group>
                    <div class="media-library-loader text-center" v-if="mediaLibraryLoading">
                        <p class="mb-3">{{ mediaLibraryLoadingMsg }}</p>
                        <b-spinner style="width: 2.5rem; height: 2.5rem;" variant="secondary"></b-spinner>
                    </div>
                </div>
            </div>

            <!-- Upload section -->
            <div class="col-3" v-if="this.uploadable">
                <div class="media-library-upload-section">
                    <div class="row no-gutters">
                        <div class="col-12">
                            <b-form-file
                                v-model="selectedFile"
                                :disabled="diabledSynced || mediaLibraryLoading"
                                :state="null"
                                size="sm"
                                type="file" 
                                name="image"
                                accept="image/png, image/jpeg"
                                placeholder="Select image file..."
                                drop-placeholder="Drop file here..." />
                        </div> 
                        <div class="col-12 mt-3">
                            <b-form-input 
                                v-model="selectedFileName"
                                class="pr-0"
                                :state="null" 
                                type="text" 
                                placeholder="Image name (optional)"
                                :disabled="diabledSynced || mediaLibraryLoading || (selectedFile == null)"
                                size="sm"/>
                        </div>
                        <div class="col-12 mt-3 text-right">
                            <b-button 
                                type="button" 
                                variant="secondary" 
                                class="px-3 py-1 btn-flat btn-flat-primary"
                                v-on:click="uploadImage"
                                :disabled="diabledSynced || mediaLibraryLoading || (selectedFile == null)">
                                <i class="fas fa-upload mr-2"></i>
                                Upload
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import ImageClient from '@/models/ImageModels/Image.client';
import RepositoryFactory from '@/repositories/RepositoryFactory';
import { Component, Prop, Emit, Vue, VModel, PropSync } from 'vue-property-decorator';
import clone from 'lodash.clone';
import { PropType } from 'vue';

@Component({})
export default class MediaLibrary extends Vue {

    @Prop({ type: Array as PropType<Array<string>>, default: () => [] }) public readonly selected!: Array<string>
    @Prop({ type: Boolean, default: true }) public readonly uploadable!: boolean;
    //@PropSync('selected', { type:  Array as PropType<Array<string>>, default: () => [] }) selectedSynced!: Array<string>;
    @PropSync('disabled', { type: Boolean, default: false }) diabledSynced!: boolean;
    @PropSync('compact', { type: Boolean, default: false }) compactSynced!: boolean;
    @PropSync('multiSelect', { type: Boolean, default: false }) multiSelectSynced!: boolean;


    /**
     * Create a clone of the marker (Use for form models)
     */
    private mutableSelected = clone(this.selected);

    /**
     * Filter dropdown selection
     */
    public filterSelection = "";

    /**
     * Filter by name
     */
    public filterName = "";

    /**
     * Array of media library items
     */
    public mediaLibrary: Array<ImageClient> = []

    /**
     * Is media library loading?
     */
    public mediaLibraryLoading = true

    /**
     * Loading message for media library
     */
    public mediaLibraryLoadingMsg = "Loading Media Library...";

    /**
     * Select file from user files
     */
    public selectedFile: File | null = null;

    /**
     * Selected file name
     */
    public selectedFileName = "";

    /**
     * On mounted callback
     */
    public async mounted() {
        await this.getMediaLibrary();
    }

    /**
     * Get media library using api
     */
    public async getMediaLibrary() {
        this.mediaLibraryLoading = true;
        this.mediaLibraryLoadingMsg = "Loading Media Library..."
        const repo = new RepositoryFactory().getImagesRepository();
        const resp = await repo.get();
        if (resp.is200) {
            this.mediaLibrary = resp.is200.data;
        }
        this.mediaLibraryLoading = false;
    }

    /**
     * Upload a new image to media library
     */
    public async uploadImage() {
        if (this.selectedFile) {
            this.mediaLibraryLoadingMsg = "Uploading image...";
            this.mediaLibraryLoading = true;
            this.encodeImageFileAsURL(this.selectedFile, async (base64Data: string) => {
                const repo = new RepositoryFactory().getImagesRepository();
                const resp = await repo.create({
                    imageName: this.selectedFileName ? this.selectedFileName : "",
                    imageBase64: base64Data,
                });
                if (resp.is201) {
                    this.mediaLibrary.unshift(resp.is201.data);
                } else if (resp.is400) {
                    console.warn(resp.is400);
                }
                this.mediaLibraryLoading = false;
            });
        }
    }

    /**
     * Convert image file to base64
     */
    public encodeImageFileAsURL(file: File, cb: any) {
        const fileToLoad = file as File;
        const fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            cb(fileLoadedEvent.target?.result); // Base 46
        }
        fileReader.readAsDataURL(fileToLoad);
    }

    /**
     * Delete an image by id
     */
    public async deleteImage(imageId: string) {
            this.mediaLibraryLoadingMsg = "Deleting image...";
            this.mediaLibraryLoading = true;
            const repo = new RepositoryFactory().getImagesRepository();
            const response = await repo.delete(imageId);
            if (response.is201) {
                this.mutableSelected = this.mutableSelected.filter((s) => {
                    return s !== imageId
                });
                this.mediaLibrary = this.mediaLibrary.filter((item) => {
                    return item.imageId !== imageId
                });
            } else if (response.is400) {
                alert(response.is400.message)
            } else if (response.is404) {
                alert('Sorry, the image could not be deleted. Please try again later.');
                console.warn(response.is404);
            }
            this.mediaLibraryLoading = false;
            this.$nextTick(() => {
                this.$emit('select', this.mutableSelected, this.mediaLibrary.filter((m) => {
                    return this.mutableSelected.includes(m.imageId);
                }));
            })
        }

    /**
     * Set selected image by id
     */
    public selectImage(imageId: string) {

        // Unselect because already selected
        if (this.mutableSelected.includes(imageId)) {
            this.mutableSelected = this.mutableSelected.filter((item) => {
                return imageId !== item;
            });
            this.$nextTick(() => {
                this.$emit('select', this.mutableSelected, this.mediaLibrary.filter((m) => {
                    return this.mutableSelected.includes(m.imageId);
                }));
            })
        } 
        
        // Else select image
        else {
            if (this.multiSelectSynced) {
                this.mutableSelected.push(imageId);
            } else {
                this.mutableSelected = [imageId];
            }
            this.$nextTick(() => {
                this.$emit('select', this.mutableSelected, this.mediaLibrary.filter((m) => {
                    return this.mutableSelected.includes(m.imageId);
                }));
            })
        }

    }

    /**
     * Computed Property
     * Get media library items depending on filter
     */
    public get mediaLibraryFiltered() {
        if (this.filterSelection == 'selected') {
            var lib = this.mediaLibrary.filter((item) => {
                return this.mutableSelected.includes(item.imageId) && item.imageName.includes(this.filterName)
            });
            return lib;
        } else {
            var lib = this.mediaLibrary.filter((item) => {
                return item.imageName.toLowerCase().includes(this.filterName.toLowerCase())
            });
            return lib;
        }
    }

    /**
     * Computed property
     * Calculate which class names should be added to media library
     */
    public get classNames () {
        const classes = [];
        if (this.diabledSynced) {
            classes.push('disabled');
        }
        if (this.compactSynced) {
            classes.push('compact');
        }
        return classes.join(' ');
    }

}
</script>

<style  lang="scss">
@import '../scss/variables.scss';
.media-library {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    padding: 0px;
    transition: opacity 200ms;

    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;

        .media-library-content,
        .media-library-title-bar {
            pointer-events: none;
        }
    }

    .media-library-title-bar {
        position: relative;
        display: block;
        width: 100%;
        border-bottom: 1px solid #ced4da;
        background-color: #f1f1f1;

        p {
            color: theme-color('black');
        }

        .media-library-file-input {

            .custom-file-label {

                &::after {
                    content: "Upload"!important
                }
            }

        }
    }

    .media-library-upload-section {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        border-left: 1px solid #ced4da;
        background-color: #fbfbfb;
        padding: 12px;
    }

    .media-library-content {
        position: relative;
        display: block;
        width: 100%;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
        padding: 12px;
        margin: 0px;

        .media-library-loader {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
            padding:60px 12px 12px 12px;
            margin: 0px;
            z-index: 100;
        }
        
        .media-library-empty {
            position: relative;
            display: block;
            width: 100%;
            height: 200px;
            padding: 12px;
        }

        .media-library-list {
            position: relative;
            display: block;
            width: 100%;
            height: auto;
            margin: 0px;
            padding: 0px;

            .media-library-list-item {
                position: relative;
                display: inline-block;
                vertical-align: top;
                list-style-type: none;
                width: 150px;
                height: 150px;
                background-color: #fbfbfb;
                margin: 0px 12px 12px 0px;
                border: 3px solid #fff;
                transition: border-color 200ms;
                overflow: hidden;

                &.active {
                    outline: 2px solid theme-color("primary");

                    .active-checkbox {
                        background-color: theme-color("primary");
                    }
                }

                .active-checkbox {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    background-color: #FFF;
                    color: #FFF;
                    z-index: 5;
                    text-align: center;
                    border-radius: 4px;
                    transition: all 200ms;
                    box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.2);
                    cursor: pointer;

                    i {
                        font-size: 14px;
                        line-height: 24px;
                    }

                    &:hover {
                        color: #FFF;
                        background-color: theme-color("primary");
                    }
                }

                .img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #fff;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                    border-radius: 4px;
                    transform: scale(1);
                    transition: transform 200ms;
                }

                .img-dropdown {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    color: #333;
                    background-color:#FFF;
                    z-index: 6;
                    box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.2);
                    border-radius: 4px;

                    button {
                        outline: none!important;
                        box-shadow: none!important;

                    }

                    > button {
                        padding: 0!important;
                        color: #666!important;
                        outline: none!important;
                    }


                }

                .caption {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background-color:rgba(0,0,0,0.75);
                    text-align: center;
                    padding: 4px;
                    font-size: 12px;
                    color: #FFF;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    border-bottom-left-radius: 2px;
                    border-bottom-right-radius: 2px;
                }
            }

        }
        
    }

    &.compact {

        .media-library-content {

            .media-library-list {

                .media-library-list-item {
                    width: 108px;
                    height: 108px;
                }
            }
        }


    }



    

}
</style>
