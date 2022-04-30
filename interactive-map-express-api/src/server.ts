import './env';
import http from 'http';
import { app } from './app';

const server = new http.Server(app);

export { server }
