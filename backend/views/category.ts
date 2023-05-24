import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const router = Router();
const prisma = new PrismaClient();

export default function (io: Server) {
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
        if (name == "") throw 1;
    } catch {
        return _res.status(400).json({ error: "no name given" });
    }
    try {
        const result = await prisma.category.create({
            data: {
                name: name,
            },
        });
            io.emit("new_category", result);
        _res.status(201).json(result);
    } catch (error) {
        _res.status(400).json(error);
    }
});

    router.post("/edit", async (_req, _res) => {
        const id = _req.body.id;
        const name = _req.body.name;
        if (name == "" || id == "" || typeof id !== "number" || typeof name !== "string")
            return _res.status(400).json({ error: "no name given" });
    try {
            const result = await prisma.category.update({ where: { id: id }, data: { name: name } });
            io.emit("category_edit", result);
            _res.status(200).json(result);
        } catch (error) {
            _res.status(500).json({ error: error });
    }
    });
    try {
        const result = await prisma.category.delete({
            where: {
                id: id,
            },
        });
            io.emit("del_category", result);
        _res.status(200).json(result);
    } catch (error) {
        _res.status(500).json({ error: error });
    }
});

export default router;
