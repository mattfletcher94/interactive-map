import axios from 'axios';
import nock from 'nock';
import { expect } from 'chai'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import mapKeyData from '../../apiResponses/MapKey'
import errorData from '../../apiResponses/Error'

// Set axios adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

/**
 * Test maps repository
 */
describe('MapKeysRepository.ts', () => {

    /**
     * Create maps repo
     */
    const repo = new RepositoryFactory().getMapKeysRepository("mapId");

    /**
     * Register nock
     */
    before(() => {
        nock(`${process.env.VUE_APP_API_BASE_URL}/`)
        .get('/public/maps/mapId/keys/').reply(200, { data: [mapKeyData, mapKeyData, mapKeyData] })
        .get('/public/maps/mapId/keys/keyId').reply(200, { data: mapKeyData })
        .get('/public/maps/mapId/keys/keyId').reply(404, { message: "Not found" })
    });

    /**
     * Successfully get
     */
    it('GET:200 maps/:id/keys', async () => {
        const resp = await repo.get();
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200.data).to.be.an("array");
    });

    /**
     * Successfully get one
     */
    it('GET:200 maps/:id/keys/:id', async () => {
        const resp = await repo.getOne('keyId');
        expect(resp.is404).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(mapKeyData);
    });

    /**
     * Unsuccessfully get one
     */
    it('GET:404 maps/:id/keys/:id', async () => {
        const resp = await repo.getOne('keyId');
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

});