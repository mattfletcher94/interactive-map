import './env';
import express, { Response as ExResponse, Request as ExRequest,  NextFunction, } from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes";
import fs from 'fs';
import errorHandler from './middleware/errorHandler';
import path from 'path';
import { Image, IImage, IImageCreate, IImageUpdate } from "./models/Image";

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION as string, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    //console.log('connected to db.');
}).catch((err) => {
    console.log(err);
});

// Create sever instance
const app = express();

// Cors
app.use(cors({
    origin: function(origin, callback){
        return callback(null, true);
    },
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'access-control-max-age']
})); 

app.use(cookieParser());
//app.use(bodyParser.urlencoded({extended: true, }));
//app.use(bodyParser.json());

app.use(express.json({limit: '10mb' }))
app.use(express.urlencoded({limit: '10mb', extended: true}))

// Init docs
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(swaggerUi.generateHTML(await import("./../swagger.json")));
});

// To serve static image files
app.get('/static/images/:imageId', async function( req, res ) {
    const parsed = path.parse(req.params.imageId);
    const imageId = parsed.name.split('-')[0];
    const isThumbnail = parsed.name.split('-').length > 1;
    const document = await Image.findOne({ _id: imageId });
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
        } else {
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

// Register routes 
RegisterRoutes(app);

// Error handler
app.use(errorHandler);


// Exports
export { app };