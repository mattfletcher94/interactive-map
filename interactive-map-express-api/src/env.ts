import { config } from 'dotenv';
import path from 'path';


let filePath = "";
if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
    filePath = path.join(path.resolve('./'), `/.env.${process.env.NODE_ENV}`);
} else {
    filePath = path.join(path.resolve('./'), `/.env`);
}

config({ 
    path: filePath
});
