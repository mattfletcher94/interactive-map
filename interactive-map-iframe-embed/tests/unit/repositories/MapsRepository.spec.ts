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
        .get('/public/maps/1').reply(200, { data: mapData })
        .get('/public/maps/2').reply(404, { message: "Not found" })
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


});