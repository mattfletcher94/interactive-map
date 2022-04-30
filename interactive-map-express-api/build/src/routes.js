"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const ImagesController_1 = require("./controllers/ImagesController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const MapKeysController_1 = require("./controllers/MapKeysController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const MapMarkersController_1 = require("./controllers/MapMarkersController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const MapsController_1 = require("./controllers/MapsController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const PublicMapKeysController_1 = require("./controllers/PublicMapKeysController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const PublicMapMarkersController_1 = require("./controllers/PublicMapMarkersController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const PublicMapsController_1 = require("./controllers/PublicMapsController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const UsersController_1 = require("./controllers/UsersController");
const authentication_1 = require("./middleware/authentication");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "Pick_IImage.Exclude_keyofIImage.imageBase64-or-imageBase64Thumbnail__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "imageUser": { "dataType": "string", "required": true }, "imageName": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IImageClient": {
        "dataType": "refObject",
        "properties": {
            "imageUser": { "dataType": "string", "required": true },
            "imageName": { "dataType": "string", "required": true },
            "imageId": { "dataType": "string", "required": true },
            "imagePath": { "dataType": "string", "required": true },
            "imagePathThumbnail": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_Array_IImageClient__": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "array", "array": { "ref": "IImageClient" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IImageClient_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "IImageClient" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "enum", "enums": [null] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IImage.Exclude_keyofIImage.imageUser-or-imageName-or-imageBase64Thumbnail__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "imageBase64": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IImageCreate": {
        "dataType": "refObject",
        "properties": {
            "imageBase64": { "dataType": "string", "required": true },
            "imageName": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponseErrors": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "errors": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "message": { "dataType": "string", "required": true }, "field": { "dataType": "string", "required": true } } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IImage.Exclude_keyofIImage.imageUser-or-imageBase64-or-imageBase64Thumbnail__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "imageName": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IImageUpdate": {
        "dataType": "refObject",
        "properties": {
            "imageName": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponseServerError": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "error": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapKeyClient": {
        "dataType": "refObject",
        "properties": {
            "mapKeyUser": { "dataType": "string", "required": true },
            "mapKeyMap": { "dataType": "string", "required": true },
            "mapKeyTitle": { "dataType": "string", "required": true },
            "mapKeyColor": { "dataType": "string", "required": true },
            "mapKeyInitialValue": { "dataType": "boolean", "required": true },
            "mapKeyId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_Array_IMapKeyClient__": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "array", "array": { "ref": "IMapKeyClient" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IMapKeyClient_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "IMapKeyClient" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IMapKey.Exclude_keyofIMapKey.mapKeyUser-or-mapKeyInitialValue__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "mapKeyMap": { "dataType": "string", "required": true }, "mapKeyTitle": { "dataType": "string", "required": true }, "mapKeyColor": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapKeyCreate": {
        "dataType": "refObject",
        "properties": {
            "mapKeyMap": { "dataType": "string", "required": true },
            "mapKeyTitle": { "dataType": "string", "required": true },
            "mapKeyColor": { "dataType": "string", "required": true },
            "mapKeyInitialValue": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapKeyUpdate": {
        "dataType": "refObject",
        "properties": {
            "mapKeyTitle": { "dataType": "string" },
            "mapKeyColor": { "dataType": "string" },
            "mapKeyInitialValue": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IMapMarker.Exclude_keyofIMapMarker.mapMarkerImages__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "mapMarkerUser": { "dataType": "string", "required": true }, "mapMarkerMap": { "dataType": "string", "required": true }, "mapMarkerKey": { "dataType": "string", "required": true }, "mapMarkerOrder": { "dataType": "double", "required": true }, "mapMarkerName": { "dataType": "string", "required": true }, "mapMarkerPositionX": { "dataType": "double", "required": true }, "mapMarkerPositionY": { "dataType": "double", "required": true }, "mapMarkerLocked": { "dataType": "boolean", "required": true }, "mapMarkerTitle": { "dataType": "string", "required": true }, "mapMarkerTitleDisplayType": { "dataType": "string", "required": true }, "mapMarkerDescription": { "dataType": "string", "required": true }, "mapMarkerPitchedUnitSelection": { "dataType": "string", "required": true }, "mapMarkerButtonEnabled": { "dataType": "boolean", "required": true }, "mapMarkerButtonLabel": { "dataType": "string", "required": true }, "mapMarkerButtonURL": { "dataType": "string", "required": true }, "mapMarkerImagesEnabled": { "dataType": "boolean", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapMarkerClient": {
        "dataType": "refObject",
        "properties": {
            "mapMarkerUser": { "dataType": "string", "required": true },
            "mapMarkerMap": { "dataType": "string", "required": true },
            "mapMarkerKey": { "dataType": "string", "required": true },
            "mapMarkerOrder": { "dataType": "double", "required": true },
            "mapMarkerName": { "dataType": "string", "required": true },
            "mapMarkerPositionX": { "dataType": "double", "required": true },
            "mapMarkerPositionY": { "dataType": "double", "required": true },
            "mapMarkerLocked": { "dataType": "boolean", "required": true },
            "mapMarkerTitle": { "dataType": "string", "required": true },
            "mapMarkerTitleDisplayType": { "dataType": "string", "required": true },
            "mapMarkerDescription": { "dataType": "string", "required": true },
            "mapMarkerPitchedUnitSelection": { "dataType": "string", "required": true },
            "mapMarkerButtonEnabled": { "dataType": "boolean", "required": true },
            "mapMarkerButtonLabel": { "dataType": "string", "required": true },
            "mapMarkerButtonURL": { "dataType": "string", "required": true },
            "mapMarkerImagesEnabled": { "dataType": "boolean", "required": true },
            "mapMarkerId": { "dataType": "string", "required": true },
            "mapMarkerImages": { "dataType": "array", "array": { "ref": "IImageClient" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_Array_IMapMarkerClient__": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "array", "array": { "ref": "IMapMarkerClient" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IMapMarkerClient_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "IMapMarkerClient" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapMarkerCreate": {
        "dataType": "refObject",
        "properties": {
            "mapMarkerMap": { "dataType": "string" },
            "mapMarkerKey": { "dataType": "string" },
            "mapMarkerOrder": { "dataType": "double" },
            "mapMarkerName": { "dataType": "string" },
            "mapMarkerPositionX": { "dataType": "double", "required": true },
            "mapMarkerPositionY": { "dataType": "double", "required": true },
            "mapMarkerLocked": { "dataType": "boolean" },
            "mapMarkerTitle": { "dataType": "string" },
            "mapMarkerTitleDisplayType": { "dataType": "string" },
            "mapMarkerDescription": { "dataType": "string" },
            "mapMarkerPitchedUnitSelection": { "dataType": "string" },
            "mapMarkerButtonEnabled": { "dataType": "boolean" },
            "mapMarkerButtonLabel": { "dataType": "string" },
            "mapMarkerButtonURL": { "dataType": "string" },
            "mapMarkerImagesEnabled": { "dataType": "boolean" },
            "mapMarkerImages": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapMarkerUpdate": {
        "dataType": "refObject",
        "properties": {
            "mapMarkerKey": { "dataType": "string" },
            "mapMarkerOrder": { "dataType": "double" },
            "mapMarkerName": { "dataType": "string" },
            "mapMarkerPositionX": { "dataType": "double" },
            "mapMarkerPositionY": { "dataType": "double" },
            "mapMarkerLocked": { "dataType": "boolean" },
            "mapMarkerTitle": { "dataType": "string" },
            "mapMarkerTitleDisplayType": { "dataType": "string" },
            "mapMarkerDescription": { "dataType": "string" },
            "mapMarkerPitchedUnitSelection": { "dataType": "string" },
            "mapMarkerButtonEnabled": { "dataType": "boolean" },
            "mapMarkerButtonLabel": { "dataType": "string" },
            "mapMarkerButtonURL": { "dataType": "string" },
            "mapMarkerImagesEnabled": { "dataType": "boolean" },
            "mapMarkerImages": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IMap.Exclude_keyofIMap.mapImage__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "mapUser": { "dataType": "string", "required": true }, "mapTitle": { "dataType": "string", "required": true }, "mapDescription": { "dataType": "string", "required": true }, "mapPitchedBookingEnabled": { "dataType": "boolean", "required": true }, "mapPitchedBookingURL": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapClient": {
        "dataType": "refObject",
        "properties": {
            "mapUser": { "dataType": "string", "required": true },
            "mapTitle": { "dataType": "string", "required": true },
            "mapDescription": { "dataType": "string", "required": true },
            "mapPitchedBookingEnabled": { "dataType": "boolean", "required": true },
            "mapPitchedBookingURL": { "dataType": "string", "required": true },
            "mapId": { "dataType": "string", "required": true },
            "mapImage": { "ref": "IImageClient", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_Array_IMapClient__": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "array", "array": { "ref": "IMapClient" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IMapClient_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "IMapClient" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IMap.Exclude_keyofIMap.mapUser-or-mapDescription-or-mapPitchedBookingEnabled-or-mapPitchedBookingURL__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "mapImage": { "dataType": "string", "required": true }, "mapTitle": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapCreate": {
        "dataType": "refObject",
        "properties": {
            "mapImage": { "dataType": "string", "required": true },
            "mapTitle": { "dataType": "string", "required": true },
            "mapDescription": { "dataType": "string" },
            "mapPitchedBookingEnabled": { "dataType": "boolean" },
            "mapPitchedBookingURL": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IMap.Exclude_keyofIMap.mapUser-or-mapTitle-or-mapDescription-or-mapImage-or-mapPitchedBookingEnabled-or-mapPitchedBookingURL__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapUpdate": {
        "dataType": "refObject",
        "properties": {
            "mapImage": { "dataType": "string" },
            "mapTitle": { "dataType": "string" },
            "mapDescription": { "dataType": "string" },
            "mapPitchedBookingEnabled": { "dataType": "boolean" },
            "mapPitchedBookingURL": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IUser.Exclude_keyofIUser.userPassword__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "userFirstName": { "dataType": "string", "required": true }, "userLastName": { "dataType": "string", "required": true }, "userEmail": { "dataType": "string", "required": true }, "userRole": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserClient": {
        "dataType": "refObject",
        "properties": {
            "userFirstName": { "dataType": "string", "required": true },
            "userLastName": { "dataType": "string", "required": true },
            "userEmail": { "dataType": "string", "required": true },
            "userRole": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IUserClient_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "IUserClient" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserUpdate": {
        "dataType": "refObject",
        "properties": {
            "userFirstName": { "dataType": "string" },
            "userLastName": { "dataType": "string" },
            "userEmail": { "dataType": "string" },
            "userPassword": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserLogin": {
        "dataType": "refObject",
        "properties": {
            "userEmail": { "dataType": "string", "required": true },
            "userPassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse__token-string__": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "nestedObjectLiteral", "nestedProperties": { "token": { "dataType": "string", "required": true } } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IUser.Exclude_keyofIUser.userRole__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "userFirstName": { "dataType": "string", "required": true }, "userLastName": { "dataType": "string", "required": true }, "userEmail": { "dataType": "string", "required": true }, "userPassword": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserCreate": {
        "dataType": "refObject",
        "properties": {
            "userFirstName": { "dataType": "string", "required": true },
            "userLastName": { "dataType": "string", "required": true },
            "userEmail": { "dataType": "string", "required": true },
            "userPassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/images', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_Array_IImageClient__" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new ImagesController_1.ImagesController();
        const promise = controller.getImages.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/images/:imageId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            imageId: { "in": "path", "name": "imageId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IImageClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new ImagesController_1.ImagesController();
        const promise = controller.getImage.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/images', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IImageCreate" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse_IImageClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new ImagesController_1.ImagesController();
        const promise = controller.postImage.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch('/images/:imageId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            imageId: { "in": "path", "name": "imageId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IImageUpdate" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IImageClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new ImagesController_1.ImagesController();
        const promise = controller.updateMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/images/:imageId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            imageId: { "in": "path", "name": "imageId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new ImagesController_1.ImagesController();
        const promise = controller.deleteMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/maps/:mapId/keys', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_Array_IMapKeyClient__" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapKeysController_1.MapKeysController();
        const promise = controller.getAll.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/maps/:mapId/keys/:keyId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            keyId: { "in": "path", "name": "keyId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapKeyClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapKeysController_1.MapKeysController();
        const promise = controller.getOne.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/maps/:mapId/keys', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IMapKeyCreate" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse_IMapKeyClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapKeysController_1.MapKeysController();
        const promise = controller.post.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch('/maps/:mapId/keys/:mapKeyId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            mapKeyId: { "in": "path", "name": "mapKeyId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IMapKeyUpdate" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapKeyClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapKeysController_1.MapKeysController();
        const promise = controller.update.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/maps/:mapId/keys/:mapKeyId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            mapKeyId: { "in": "path", "name": "mapKeyId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapKeysController_1.MapKeysController();
        const promise = controller.deleteMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/maps/:mapId/markers', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_Array_IMapMarkerClient__" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapMarkersController_1.MapMarkersController();
        const promise = controller.getMapMarkers.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/maps/:mapId/markers/:mapMarkerId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            mapMarkerId: { "in": "path", "name": "mapMarkerId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapMarkerClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapMarkersController_1.MapMarkersController();
        const promise = controller.getMapMarker.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/maps/:mapId/markers', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IMapMarkerCreate" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse_IMapMarkerClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapMarkersController_1.MapMarkersController();
        const promise = controller.postMapMarker.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch('/maps/:mapId/markers/:mapMarkerId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            mapMarkerId: { "in": "path", "name": "mapMarkerId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IMapMarkerUpdate" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapMarkerClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapMarkersController_1.MapMarkersController();
        const promise = controller.updateMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/maps/:mapId/markers/:mapMarkerId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            mapMarkerId: { "in": "path", "name": "mapMarkerId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapMarkersController_1.MapMarkersController();
        const promise = controller.deleteMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/maps', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_Array_IMapClient__" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapsController_1.MapsController();
        const promise = controller.getMaps.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/maps/:mapId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapsController_1.MapsController();
        const promise = controller.getMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/maps', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IMapCreate" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse_IMapClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapsController_1.MapsController();
        const promise = controller.postMaps.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch('/maps/:mapId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IMapUpdate" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapsController_1.MapsController();
        const promise = controller.updateMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/maps/:mapId', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new MapsController_1.MapsController();
        const promise = controller.deleteMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/public/maps/:mapId/keys', function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_Array_IMapKeyClient__" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new PublicMapKeysController_1.PublicMapKeysController();
        const promise = controller.getMapMarkers.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/public/maps/:mapId/keys/:mapKeyId', function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            mapKeyId: { "in": "path", "name": "mapKeyId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapKeyClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new PublicMapKeysController_1.PublicMapKeysController();
        const promise = controller.getMapMarker.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/public/maps/:mapId/markers', function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_Array_IMapMarkerClient__" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new PublicMapMarkersController_1.PublicMapMarkersController();
        const promise = controller.getMapMarkers.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/public/maps/:mapId/markers/:mapMarkerId', function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            mapMarkerId: { "in": "path", "name": "mapMarkerId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapMarkerClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
            response500: { "in": "res", "name": "500", "required": true, "ref": "IResponseServerError" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new PublicMapMarkersController_1.PublicMapMarkersController();
        const promise = controller.getMapMarker.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/public/maps/:mapId', function (request, response, next) {
        const args = {
            mapId: { "in": "path", "name": "mapId", "required": true, "dataType": "string" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IMapClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new PublicMapsController_1.PublicMapsController();
        const promise = controller.getMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/users/self', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IUserClient_" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new UsersController_1.UsersController();
        const promise = controller.userGetSelf.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch('/users/self', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IUserUpdate" },
            response200: { "in": "res", "name": "200", "required": true, "ref": "IResponse_IUserClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new UsersController_1.UsersController();
        const promise = controller.updateMap.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/users/self', authenticateMiddleware([{ "jwt": [] }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse" },
            response404: { "in": "res", "name": "404", "required": true, "ref": "IResponse" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new UsersController_1.UsersController();
        const promise = controller.userDelete.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/users/login', function (request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "ref": "IUserLogin" },
            resposne200: { "in": "res", "name": "200", "required": true, "ref": "IResponse__token-string__" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new UsersController_1.UsersController();
        const promise = controller.userLogin.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/users/register', function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IUserCreate" },
            response201: { "in": "res", "name": "201", "required": true, "ref": "IResponse_IUserClient_" },
            response400: { "in": "res", "name": "400", "required": true, "ref": "IResponseErrors" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const controller = new UsersController_1.UsersController();
        const promise = controller.userRegister.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return (request, _response, next) => {
            let responded = 0;
            let success = false;
            const succeed = function (user) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const fail = function (error) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = error.status || 401;
                    next(error);
                }
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises = [];
                    for (const name in secMethod) {
                        promises.push(authentication_1.expressAuthentication(request, name, secMethod[name]));
                    }
                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                }
                else {
                    for (const name in secMethod) {
                        authentication_1.expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus();
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data || data === false) { // === false allows boolean result
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
