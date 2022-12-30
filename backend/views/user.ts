import {Router} from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.put('/create', async (_req, _res) => {
    try {
        const result = await prisma.user.create({
            data: {
                username: "aaa",
                pass_hash: "bbb",
                salt: "qqq"
            }
        })
        _res.status(201).json(result)
    } catch(error) {
        _res.status(400).json({error: error})
    }
})

router.get('/get/:id', async (_req, _res) => {
    const { id } = _req.params;
    const result = await prisma.user.findUnique({
        where: {
            id: Number(id)
        }, 
        select: {
            id: true,
            username: true
        }
    })
    if (result){
        _res.status(200).json(result)
    } else {
        _res.status(404).json({error: "User not found"})
    }
})

export default router