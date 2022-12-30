import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import * as crypto from 'crypto';
import { Prisma, PrismaClient } from '@prisma/client';
import user from './views/user';

const storage: multer.StorageEngine = multer.diskStorage({
   destination: (_req, _file, _cb) => {
    _cb(null, 'uploads');
   },
   filename: (_req, _file, _cb) => {
    _cb(null, Date.now()+'-'+_file.originalname);
   }
});

const app: express.Application = express();
const upload: multer.Multer = multer({storage: storage});
const prisma = new PrismaClient()

const port: number = 3500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (_req, _res) => {
    _res.status(200).send({"status": "ok"});
});

app.post('/profile', upload.single('avatar'), (_req, _res, _next) => {
    console.log(_req.file, _req.body);
    _res.json(_req.body);
});

app.listen(port, () => {
    console.log(`TypeScript with Express on http://localhost:${port}/`);
});