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
        .get('/maps/mapId/keys/').reply(200, { data: [mapKeyData, mapKeyData, mapKeyData] })
        .get('/maps/mapId/keys/keyId').reply(200, { data: mapKeyData })
        .get('/maps/mapId/keys/keyId').reply(404, { message: "Not found" })
        .post('/maps/mapId/keys/').reply(201, { data: mapKeyData })
        .post('/maps/mapId/keys/').reply(400, { errors: [errorData] })
        .patch('/maps/mapId/keys/keyId').reply(200, { data: mapKeyData })
        .patch('/maps/mapId/keys/keyId').reply(400, { errors: [errorData] })
        .patch('/maps/mapId/keys/keyId').reply(404, { message: "Not found" })
        .delete('/maps/mapId/keys/keyId').reply(201, { message: "Deleted" })
        .delete('/maps/mapId/keys/keyId').reply(404, { message: "Not found" })
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

    /**
     * Succesfully create
     */
    it('POST:201 maps/:id/keys', async () => {
        const resp = await repo.create({
            mapKeyMap: "1",
            mapKeyTitle: "key title",
            mapKeyColor: "color",
            mapKeyInitialValue: false
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is201).to.not.be.undefined;
        expect(resp.is201?.data).deep.equal(mapKeyData);
    });

    /**
     * Unuccesfully create
     */
    it('POST:400 maps/:id/keys', async () => {
        const resp = await repo.create({
            mapKeyMap: "1",
            mapKeyTitle: "key title",
            mapKeyColor: "color",
            mapKeyInitialValue: false
        });
        expect(resp.is201).to.be.undefined;
        expect(resp.is400).to.not.be.undefined;
        expect(resp.is400?.errors[0]).deep.equal(errorData);
    });

    /**
     * Succesfully update
     */
    it('PATCH:200 maps/:id/keys/:id', async () => {
        const resp = await repo.update("keyId", {
            mapKeyTitle: "updated",
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is404).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(mapKeyData);
    });

    /**
     * Unuccesfully update (validation errors)
     */
    it('PATCH:404 maps/:id/keys/:id', async () => {
        const resp = await repo.update("keyId", {
            mapKeyTitle: "updated",
        });
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.be.undefined;
        expect(resp.is400).to.not.be.undefined;
        expect(resp.is400?.errors[0]).deep.equal(errorData);
    });

    /**
     * Unuccesfully update (doesn't exist)
     */
    it('PATCH:404 maps/:id/keys/:id', async () => {
        const resp = await repo.update("keyId", {
            mapKeyTitle: "updated",
        });
        expect(resp.is400).to.be.undefined;
        expect(resp.is200).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

    /**
     * Succesfully delete one
     */
    it('DELETE:201 maps/:id/keys/:id', async () => {
        const resp = await repo.delete("keyId");
        expect(resp.is201).to.not.be.undefined;
        expect(resp.is404).to.be.undefined;
    });

    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 maps/:id/keys/:id', async () => {
        const resp = await repo.delete("keyId");
        expect(resp.is201).to.be.undefined;
        expect(resp.is404).to.not.be.undefined;
    });

});