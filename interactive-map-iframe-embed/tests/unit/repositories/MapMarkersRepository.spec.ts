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
        .get('/public/maps/mapId/markers/').reply(200, { data: [mapMarkerData, mapMarkerData, mapMarkerData] })
        .get('/public/maps/mapId/markers/markerId').reply(200, { data: mapMarkerData })
        .get('/public/maps/mapId/markers/markerId').reply(404, { message: "Not found" })
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


});