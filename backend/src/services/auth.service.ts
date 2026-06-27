import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userDao from '../dao/user.dao';
import { verifyGoogleIdToken } from '../utils/googleVerify';
import { toUserDTO } from '../mappers/user.mapper';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const signToken = (userId: string, role: string) =>
    jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });

export const register = async (username: string, email: string, password: string) => {
    const existingEmail = await userDao.findUserByEmail(email);
    if (existingEmail) throw new Error('Email already in use');

    const existingUsername = await userDao.findUserByUsername(username);
    if (existingUsername) throw new Error('Username already taken');

    const hashed = await bcrypt.hash(password, 10);
    const user = await userDao.createUser({ username, email, password: hashed });
    const token = signToken(String(user._id), user.role);
    return { user: toUserDTO(user), token };
};

export const login = async (email: string, password: string) => {
    const user = await userDao.findUserByEmail(email);
    if (!user || !user.password) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = signToken(String(user._id), user.role);
    return { user: toUserDTO(user), token };
};

export const googleLogin = async (idToken: string) => {
    const payload = await verifyGoogleIdToken(idToken);

    let user = await userDao.findUserByGoogleId(payload.sub);
    if (!user) {
        const existing = await userDao.findUserByEmail(payload.email);
        if (existing) {
            user = await userDao.updateUser(String(existing._id), {
                googleId: payload.sub,
                avatar: payload.picture,
            });
        } else {
            let username = payload.name || payload.email.split('@')[0];
            const takenUsername = await userDao.findUserByUsername(username);
            if (takenUsername) {
                username = `${payload.email.split('@')[0]}_${Date.now().toString().slice(-4)}`;
            }
            user = await userDao.createUser({
                username,
                email: payload.email,
                googleId: payload.sub,
                avatar: payload.picture,
            });
        }
    }

    const token = signToken(String(user!._id), user!.role);
    return { user: toUserDTO(user!), token };
};

export const getMe = async (userId: string) => {
    const user = await userDao.findUserById(userId);
    if (!user) throw new Error('User not found');
    return toUserDTO(user);
};
