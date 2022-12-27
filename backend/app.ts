import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

const app: express.Application = express();
const upload: multer.Multer = multer({dest: 'uploads/'});

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