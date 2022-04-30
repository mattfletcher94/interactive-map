"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("./env");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const path_1 = __importDefault(require("path"));
const Image_1 = require("./models/Image");
// Connect to MongoDB
mongoose_1.default.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    //console.log('connected to db.');
}).catch((err) => {
    console.log(err);
});
// Create sever instance
const app = express_1.default();
exports.app = app;
// Cors
app.use(cors_1.default({
    origin: function (origin, callback) {
        return callback(null, true);
    },
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'access-control-max-age']
}));
app.use(cookie_parser_1.default());
//app.use(bodyParser.urlencoded({extended: true, }));
//app.use(bodyParser.json());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
// Init docs
app.use("/docs", swagger_ui_express_1.default.serve, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("./../swagger.json")))));
}));
// To serve static image files
app.get('/static/images/:imageId', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = path_1.default.parse(req.params.imageId);
        const imageId = parsed.name.split('-')[0];
        const isThumbnail = parsed.name.split('-').length > 1;
        const document = yield Image_1.Image.findOne({ _id: imageId });
        if (document) {
            if (isThumbnail) {
                if (document.imageBase64Thumbnail) {
                    var img = Buffer.from(document.imageBase64Thumbnail, 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': img.length
                    });
                    res.end(img);
                }
            }
            else {
                if (document.imageBase64) {
                    var img = Buffer.from(document.imageBase64, 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': img.length
                    });
                    res.end(img);
                }
            }
        }
        // End request
        return res.end();
    });
});
// Register routes 
routes_1.RegisterRoutes(app);
// Error handler
app.use(errorHandler_1.default);
