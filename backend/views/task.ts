import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "./tools/middleware";
import { Server } from "socket.io";

const router = Router();
const prisma = new PrismaClient();

export default function (io: Server) {
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
        if (name == "" || category_id == "") {
            return _res.status(400).json({ error: "no name or category id given" });
        }
        try {
            const result = await prisma.task.create({
                data: {
                    category: { connect: { id: category_id } },
                    name: name,
                },
            });
            io.emit("new_task", result);
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
            io.emit("move_task", result);
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
            io.emit("del_task", result);
            _res.status(200).json(result);
        } catch (error) {
            _res.status(500).json({ error: error });
        }
    });
    return router;
}
