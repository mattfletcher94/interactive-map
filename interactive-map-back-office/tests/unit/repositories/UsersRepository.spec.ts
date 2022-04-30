import axios from 'axios';
import nock from 'nock';
import { expect } from 'chai'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import userData from '../../apiResponses/User'
import errorData from '../../apiResponses/Error'

// Set axios adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

/**
 * Test maps repository
 */
describe('UsersRepository.ts', () => {

    /**
     * Create maps repo
     */
    const repo = new RepositoryFactory().getUsersRepository();

    /**
     * Register nock
     */
    before(() => {
        nock(`${process.env.VUE_APP_API_BASE_URL}/`)
        .get('/users/self').reply(200, { data: userData })
        .post('/users/login').reply(200, { data: { token: "12345" } })
        .post('/users/login').reply(400, { errors: [errorData] })
    });

    /**
     * Successfully get self
     */
    it('GET:200 users/self', async () => {
        const resp = await repo.getSelf();
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal(userData);
    });

    /**
     * Successfully login
     */
    it('GET:200 users/login', async () => {
        const resp = await repo.login('user', "pass");
        expect(resp.is400).to.be.undefined;
        expect(resp.is200).to.not.be.undefined;
        expect(resp.is200?.data).deep.equal({ token: "12345" });
    });

    /**
     * Unsuccessfully log in
     */
    it('GET:400 users/login', async () => {
        const resp = await repo.login('user', "pass");
        expect(resp.is200).to.be.undefined;
        expect(resp.is400).to.not.be.undefined;
        expect(resp.is400?.errors[0]).deep.equal(errorData);
    });
});