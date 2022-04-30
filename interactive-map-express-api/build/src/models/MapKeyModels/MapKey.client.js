"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapKeyClient {
    constructor({ mapKeyId = "", mapKeyUser = "", mapKeyMap = "", mapKeyTitle = "", mapKeyColor = "", mapKeyInitialValue = false, mapKeyCreatedAt = "", mapKeyUpdatedAt = "", } = {}) {
        this.mapKeyId = "";
        this.mapKeyUser = "";
        this.mapKeyMap = "";
        this.mapKeyTitle = "";
        this.mapKeyColor = "";
        this.mapKeyInitialValue = false;
        this.mapKeyCreatedAt = "";
        this.mapKeyUpdatedAt = "";
        this.mapKeyId = mapKeyId;
        this.mapKeyUser = mapKeyUser;
        this.mapKeyMap = mapKeyMap;
        this.mapKeyTitle = mapKeyTitle;
        this.mapKeyColor = mapKeyColor;
        this.mapKeyInitialValue = mapKeyInitialValue;
        this.mapKeyCreatedAt = mapKeyCreatedAt;
        this.mapKeyUpdatedAt = mapKeyUpdatedAt;
    }
}
exports.default = MapKeyClient;
