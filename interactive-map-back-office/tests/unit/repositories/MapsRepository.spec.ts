import axios from 'axios';
import nock from 'nock';
import { expect } from 'chai'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import mapData from '../../apiResponses/Map'
import errorData from '../../apiResponses/Error'

// Set axios adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

/**
 * Test maps repository
 */
describe('MapsRepository.ts', () => {

    /**
     * Create maps repo
     */
    const repo = new RepositoryFactory().getMapsRepository();

    /**
     * Register nock
     */
    before(() => {
        nock(`${process.env.VUE_APP_API_BASE_URL}/`)
        .get('/maps/').reply(200, { data: [mapData, mapData, mapData] })
        .get('/maps/1').reply(200, { data: mapData })
        .get('/maps/2').reply(404, { message: "Not found" })
        .post('/maps/').reply(201, { data: mapData })
        .post('/maps/').reply(400, { errors: [errorData] })
        .patch('/maps/1').reply(200, { data: mapData })
        .patch('/maps/2').reply(400, { errors: [errorData] })
        .patch('/maps/3').reply(404, { message: "Not found" })
        .delete('/maps/1').reply(201, { message: "Deleted" })
        .delete('/maps/2').reply(404, { message: "Not found" })
    });

    /**
     * Successfully get
     */
    it('GET:200 maps', async () => {
        const resp = await repo.get();
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200.data).to.be.an("array");
    });

    /**
     * Successfully get one
     */
    it('GET:200 maps/:id', async () => {
        const resp = await repo.getOne('1');
        expect(resp.is404).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(mapData);
    });

    /**
     * Unsuccessfully get one
     */
    it('GET:404 maps/:id', async () => {
        const resp = await repo.getOne('2');
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

    /**
     * Succesfully create
     */
    it('POST:201 maps', async () => {
        const resp = await repo.create({
            mapTitle: mapData.mapTitle,
            mapDescription: mapData.mapDescription,
            mapImage: mapData.mapImage.imageId
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is201).to.not.be.undefined;
        expect(resp.is201?.data).deep.equal(mapData);
    });

    /**
     * Unuccesfully create
     */
    it('POST:400 maps', async () => {
        const resp = await repo.create({
            mapTitle: mapData.mapTitle,
            mapDescription: mapData.mapDescription,
            mapImage: mapData.mapImage.imageId
        });
        expect(resp.is201).to.be.undefined;
        expect(resp.is400).to.not.be.undefined;
        expect(resp.is400?.errors[0]).deep.equal(errorData);
    });

    /**
     * Succesfully update
     */
    it('PATCH:200 maps/:id', async () => {
        const resp = await repo.update(mapData.mapId, {
            mapTitle: mapData.mapTitle,
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is404).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(mapData);
    });

    /**
     * Unuccesfully update (validation errors)
     */
    it('PATCH:404 maps/:id', async () => {
        const resp = await repo.update('2', {
            mapTitle: mapData.mapTitle,
        });
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.be.undefined;
        expect(resp.is400).to.not.be.undefined;
        expect(resp.is400?.errors[0]).deep.equal(errorData);
    });

    /**
     * Unuccesfully update (doesn't exist)
     */
    it('PATCH:404 maps/:id', async () => {
        const resp = await repo.update('3', {
            mapTitle: mapData.mapTitle,
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

    /**
     * Succesfully delete one
     */
    it('DELETE:201 maps/:id/', async () => {
        const resp = await repo.delete('1');
        expect(resp.is201).to.not.be.undefined;
        expect(resp.is404).to.be.undefined;
    });

    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 maps/:id/', async () => {
        const resp = await repo.delete('2');
        expect(resp.is201).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

});