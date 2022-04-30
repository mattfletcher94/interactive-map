"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
require("./env");
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const server = new http_1.default.Server(app_1.app);
exports.server = server;
