import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "./tools/middleware";

const router = Router();
const prisma = new PrismaClient();

router.use(userMiddleware);

router.get("/", async (_req, _res) => {
    try {
        const result = await prisma.category.findMany();
        _res.status(200).json(result);
    } catch (error) {
        _res.status(500).json({ error: error });
    }
});

router.post("/new", async (_req, _res) => {
    let name = "";
    try {
        name = _req.body.name;
    } catch {
        return _res.status(400).json({ error: "no name given" });
    }
    try {
        const result = await prisma.category.create({
            data: {
                name: name,
            },
        });
        _res.status(201).json(result);
    } catch (error) {
        _res.status(400).json(error);
    }
});

router.post("/delete", async (_req, _res) => {
    let id: number | undefined;
    try {
        id = _req.body.id;
    } catch {
        return _res.status(400).json({ error: "no id given" });
    }
    try {
        const result = await prisma.category.delete({
            where: {
                id: id,
            },
        });
        _res.status(200).json(result);
    } catch (error) {
        _res.status(500).json({ error: error });
    }
});

export default router;
