import { Router } from "express";
import { config as dotenv_config } from "dotenv";
const router = Router();

dotenv_config();
dotenv_config({ path: ".env.local", override: true });

router.post("/login", async (_req, _res) => {
    const password = _req.body.password || "";
    if (typeof password !== "string") return _res.status(400).json({ error: "bad request" });
    if (password === process.env.PASSWORD) {
        _res.status(200).json({ status: "ok" });
    } else {
        _res.status(403).json({ error: "bad password" });
    }
});
export default router;

//? For user create/login via username & password
/*
router.get("/get/:id", async (_req, _res) => {
    const { id } = _req.params;
    const result = await prisma.user.findUnique({
        where: {
            id: Number(id),
        },
        select: {
            id: true,
            username: true,
        },
    });
    if (result) {
        _res.status(200).json(result);
    } else {
        _res.status(404).json({ error: "User not found" });
    }
});
router.put("/create", async (_req, _res) => {
    let username = "";
    let password = "";
    try {
        username = _req.body.username;
        password = _req.body.password;
    } catch (error) {
        _res.send(400).json({ error: "bad request" });
        return;
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const pass_hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
    try {
        const result = await prisma.user.create({
            data: {
                username: username,
                pass_hash: pass_hash,
                salt: salt,
            },
        });
        _res.status(201).json(result);
    } catch (error) {
        _res.status(400).json({ error: error });
    }
});
router.post("/login", async (_req, _res) => {
    let username = "";
    let password = "";
    try {
        username = _req.body.username;
        password = _req.body.password;
    } catch (error) {
        _res.send(400).json({ error: "bad request" });
        return;
    }
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    if (user) {
        if (validPassword(password, user.pass_hash, user.salt)) {
            _res.status(200).json({ status: "ok" });
        } else {
            _res.status(401).json({ error: "Invalid password or username" });
        }
    } else {
        _res.status(401).json({ error: "Invalid password or username" });
    }
});*/
