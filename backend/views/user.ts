import {Router} from 'express';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

router.put('/create', async (_req, _res) => {
    const { username, password } = _req.body
    const salt = crypto.randomBytes(16).toString('hex');
    const pass_hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    try {
        const result = await prisma.user.create({
            data: {
                username: username,
                pass_hash: pass_hash,
                salt: salt
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