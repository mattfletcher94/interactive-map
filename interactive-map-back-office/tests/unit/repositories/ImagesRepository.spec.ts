import axios from 'axios';
import nock from 'nock';
import { expect } from 'chai'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import imageData from '../../apiResponses/Image'

// Set axios adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

/**
 * Test maps repository
 */
describe('ImagesRepository.ts', () => {

    /**
     * Create maps repo
     */
    const repo = new RepositoryFactory().getImagesRepository();

    /**
     * Register nock
     */
    before(() => {
        nock(`${process.env.VUE_APP_API_BASE_URL}/`)
        .get('/images/').reply(200, { data: [imageData, imageData, imageData] })
        .get('/images/1').reply(200, { data: imageData })
        .get('/images/2').reply(404, { message: "Not found" })
        .delete('/images/1').reply(201, { message: "Deleted" })
        .delete('/images/2').reply(404, { message: "Not found" })
    });

    /**
     * Successfully get
     */
    it('GET:200 images', async () => {
        const resp = await repo.get();
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200.data).to.be.an("array");
    });

    /**
     * Successfully get one
     */
    it('GET:200 images/:id', async () => {
        const resp = await repo.getOne('1');
        expect(resp.is404).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(imageData);
    });

    /**
     * Unsuccessfully get one
     */
    it('GET:404 images/:id', async () => {
        const resp = await repo.getOne('2');
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });


    /**
     * Succesfully delete one
     */
    it('DELETE:201 images/:id/', async () => {
        const resp = await repo.delete('1');
        expect(resp.is201).to.not.be.undefined;
        expect(resp.is404).to.be.undefined;
    });

    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 images/:id/', async () => {
        const resp = await repo.delete('2');
        expect(resp.is201).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

});