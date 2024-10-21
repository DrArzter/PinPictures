import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { signToken } from '@/utils/jwt';
import { verifyPassword } from '@/utils/verifyPassword';
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs';
import cookie from 'cookie';

import { z } from 'zod';


const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method == '!POST') {
        return res.status(405).json({ message: 'Unsupported method' });
    }

    try {
        loginSchema.parse(req.body);

        const { email, password } = req.body as { email: string, password: string };

        const user = await prisma.user.findUnique({
            where: {
                email
            },
        });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'No such user' });
        }

        const passVerified = await bcrypt.compare(password, user.password);

        if (!passVerified) {
            return res.status(401).json({ status: 'error', message: 'Wrong password' });
        }

        const token = signToken(user);

        res.setHeader('Set-Cookie', [
            `token=${token}; SameSite=lax; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30};` +
            (process.env.NODE_ENV === 'production' ? ' Secure;' : '')
        ]);


        return res.status(200).json({ status: 'success', message: 'Login successful', token: token });

    } catch (error: any) {
        console.log(error)
        if (error.issues) {
            return res.status(401).json({ status: 'error', message: error.issues[0].message });
        }
    }

}