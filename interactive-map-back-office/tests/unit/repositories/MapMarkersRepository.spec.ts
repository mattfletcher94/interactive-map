import axios from 'axios';
import nock from 'nock';
import { expect } from 'chai'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import mapMarkerData from '../../apiResponses/MapMarker'
import errorData from '../../apiResponses/Error'

// Set axios adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

/**
 * Test maps repository
 */
describe('MapMarkersRepository.ts', () => {

    /**
     * Create maps repo
     */
    const repo = new RepositoryFactory().getMapMarkersRepository("mapId");

    /**
     * Register nock
     */
    before(() => {
        nock(`${process.env.VUE_APP_API_BASE_URL}/`)
        .get('/maps/mapId/markers/').reply(200, { data: [mapMarkerData, mapMarkerData, mapMarkerData] })
        .get('/maps/mapId/markers/markerId').reply(200, { data: mapMarkerData })
        .get('/maps/mapId/markers/markerId').reply(404, { message: "Not found" })
        .post('/maps/mapId/markers/').reply(201, { data: mapMarkerData })
        .post('/maps/mapId/markers/').reply(400, { errors: [errorData] })
        .patch('/maps/mapId/markers/markerId').reply(200, { data: mapMarkerData })
        .patch('/maps/mapId/markers/markerId').reply(400, { errors: [errorData] })
        .patch('/maps/mapId/markers/markerId').reply(404, { message: "Not found" })
        .delete('/maps/mapId/markers/markerId').reply(201, { message: "Deleted" })
        .delete('/maps/mapId/markers/markerId').reply(404, { message: "Not found" })
    });

    /**
     * Successfully get
     */
    it('GET:200 maps/:id/markers', async () => {
        const resp = await repo.get();
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200.data).to.be.an("array");
    });

    /**
     * Successfully get one
     */
    it('GET:200 maps/:id/markers/:id', async () => {
        const resp = await repo.getOne('markerId');
        expect(resp.is404).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(mapMarkerData);
    });

    /**
     * Unsuccessfully get one
     */
    it('GET:404 maps/:id/markers/:id', async () => {
        const resp = await repo.getOne('markerId');
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

    /**
     * Succesfully create
     */
    it('POST:201 maps/:id/markers', async () => {
        const resp = await repo.create({
            mapMarkerTitle: "title",
            mapMarkerKey: "1",
            mapMarkerMap: "1",
            mapMarkerDescription: "",
            mapMarkerPositionX: 100,
            mapMarkerPositionY: 100,
            mapMarkerName: "name",
            mapMarkerOrder: 1,
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is201).to.not.be.undefined;
        expect(resp.is201?.data).deep.equal(mapMarkerData);
    });

    /**
     * Unuccesfully create
     */
    it('POST:400 maps/:id/markers', async () => {
        const resp = await repo.create({
            mapMarkerTitle: "title",
            mapMarkerKey: "1",
            mapMarkerMap: "1",
            mapMarkerDescription: "",
            mapMarkerPositionX: 100,
            mapMarkerPositionY: 100,
            mapMarkerName: "name",
            mapMarkerOrder: 1,
        });
        expect(resp.is201).to.be.undefined;
        expect(resp.is400).to.not.be.undefined;
        expect(resp.is400?.errors[0]).deep.equal(errorData);
    });

    /**
     * Succesfully update
     */
    it('PATCH:200 maps/:id/markers/:id', async () => {
        const resp = await repo.update("markerId", {
            mapMarkerOrder: 10,
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is404).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(mapMarkerData);
    });

    /**
     * Unuccesfully update (validation errors)
     */
    it('PATCH:404 maps/:id/markers/:id', async () => {
        const resp = await repo.update("markerId", {
            mapMarkerOrder: 10,
        });
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.be.undefined;
        expect(resp.is400).to.not.be.undefined;
        expect(resp.is400?.errors[0]).deep.equal(errorData);
    });

    /**
     * Unuccesfully update (doesn't exist)
     */
    it('PATCH:404 maps/:id/markers/:id', async () => {
        const resp = await repo.update("markerId", {
            mapMarkerOrder: 10,
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

    /**
     * Succesfully delete one
     */
    it('DELETE:201 maps/:id/markers/:id', async () => {
        const resp = await repo.delete("markerId");
        expect(resp.is201).to.not.be.undefined;
        expect(resp.is404).to.be.undefined;
    });

    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 maps/:id/markers/:id', async () => {
        const resp = await repo.delete("markerId");
        expect(resp.is201).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

});