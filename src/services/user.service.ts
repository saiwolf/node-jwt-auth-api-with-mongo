import config from '../_config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../_helpers/db';
import { User } from '../models/user.model';

export interface IUserServiceProps {
    id?: string,
    username?: string,
    password?: string,
    ipAddress?: string,
    token?: string,
}

async function authenticate({ username, password, ipAddress }: IUserServiceProps) {
    const user = await db.User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Username or password is incorrect');
    }

    // auth successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return {
        ...basicDetails(user),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }: IUserServiceProps) {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(user);

    // return basic details and tokens
    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }: IUserServiceProps) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function getAll() {
    const users = await db.User.find();
    return users.map(x => basicDetails(x));
}

async function getById(id: string) {
    const user = await getUser(id);
    return basicDetails(user);
}

async function getRefreshTokens(userId: string) {
    // check that user exists
    await getUser(userId);

    // return refresh tokens for user
    const refreshTokens = await db.RefreshToken.find({ user: userId });
    return refreshTokens;
}

// helper functions
async function getUser(id: string) {
    if (!db.isValidId(id)) throw new Error('User not found');
    const user = await db.User.findById(id);
    if (!user) throw new Error('User not found');
    return user;
}

async function getRefreshToken(token: string) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw new Error('Invalid token');
    return refreshToken;
}

function generateJwtToken(user: IUserServiceProps) {
    return jwt.sign({
        sub: user.id,
        id: user.id,
    },
    config.app.secret,
    {
        expiresIn: '15m',
    });
}

function generateRefreshToken(user: IUserServiceProps, ipAddress: string) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdBy: ipAddress,
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user: User) {
    const { id, firstName, lastName, username, role } = user;
    return { id, firstName, lastName, username, role };
}

export default {
    authenticate,
    refreshToken,
    revokeToken,
    getAll,
    getById,
    getRefreshTokens,
}
