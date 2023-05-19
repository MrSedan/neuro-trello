import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "./tools/middleware";

const router = Router();
const prisma = new PrismaClient();

router.use(userMiddleware);

router.get("/", async (_req, _res) => {
    try {
        const result = await prisma.task.findMany();
        _res.status(200).json(result);
    } catch (error) {
        _res.status(500).json({ error: error });
    }
});

router.post("/new", async (_req, _res) => {
    const name = _req.body.name;
    const category_id = _req.body.category_id;
    try {
        const result = await prisma.task.create({
            data: {
                category: { connect: { id: category_id } },
                name: name,
            },
        });
        _res.status(201).json(result);
    } catch (error) {
        _res.status(500).json({ error: error });
    }
});

router.post("/move", async (_req, _res) => {
    const id = _req.body.id;
    const category_id = _req.body.category_id;
    try {
        const result = await prisma.task.update({
            where: {
                id: id,
            },
            data: {
                category: { connect: { id: category_id } },
            },
        });
        _res.status(200).json(result);
    } catch (error) {
        _res.status(500).json({ error: error });
    }
});

router.post("/delete", async (_req, _res) => {
    const id = _req.body.id;
    try {
        const result = await prisma.task.delete({
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
