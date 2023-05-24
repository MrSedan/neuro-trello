import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import user from "./views/user";
import category from "./views/category";
import task from "./views/task";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const storage: multer.StorageEngine = multer.diskStorage({
    destination: (_req, _file, _cb) => {
        _cb(null, "uploads");
    },
    filename: (_req, _file, _cb) => {
        _cb(null, Date.now() + "-" + _file.originalname);
    },
});

const prisma = new PrismaClient();

const app: express.Application = express();
const upload: multer.Multer = multer({ storage: storage });
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    // transports: ["polling"],
    // pingTimeout: 180000,
});

const port: number = 3500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use("/user", user(io));
app.use("/category", category);
app.use("/task", task(io));

app.set("Access-Control-Allow-Origin", "*");

app.get("/", (_req, _res) => {
    _res.status(200).send({ status: "ok" });
});

app.post("/profile", upload.single("avatar"), (_req, _res, _next) => {
    console.log(_req.file, _req.body);
    _res.json(_req.body);
});

interface MyError extends Error {
    data: any;
}

io.use(async (socket, next) => {
    const pass = socket.handshake.auth.pass;
    console.log("Someone trying to connect with pass", pass);
    if (pass === process.env.PASSWORD) {
        return next();
    }
    const err = new Error("bad pass") as MyError;
    err.data = { type: "Wrong pass" };
    return await next(err);
});

io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
        socket.removeAllListeners();
    });
    socket.on("message", (message) => {
        console.log("Client sent message:", message);
        io.emit("message", "hey, you sent " + message);
    });
    socket.on("userConnected", (message) => {
        console.log(message);
    });
    socket.on("get_tasks", async () => {
        const tasks = await prisma.task.findMany();
        socket.emit("tasks", tasks);
    });
    socket.on("get_categories", async () => {
        const categories = await prisma.category.findMany();
        socket.emit("categories", categories);
    });
});

server.listen(port, () => {
    console.log(`TypeScript with Express on http://localhost:${port}/`);
});
