import express, { Request, Response, NextFunction, CookieOptions } from 'express';
import Joi from 'joi';
import validateRequest from '../_middleware/validate-request';
import authorize from '../_middleware/authorize';
import Role from '../_helpers/role';
import userService, { IUserServiceProps } from '../services/user.service';

const router = express.Router();

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.get('/', authorize([Role.Admin]), getAll);
router.get('/:id', authorize(), getById);
router.get('/:id/refresh-tokens', authorize(), getRefreshTokens);

export default router;

// helpers
function authenticateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    const userProps: IUserServiceProps = { username, password, ipAddress };

    userService.authenticate(userProps)
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

function refreshToken(req: any, res: Response, next: NextFunction) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    userService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

function revokeTokenSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function revokeToken(req: any, res: Response, next: NextFunction) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userProps: IUserServiceProps = { token, ipAddress }
    userService.revokeToken(userProps)
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

function getAll(req: Request, res: Response, next: NextFunction) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req: any, res: Response, next: NextFunction) {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

function getRefreshTokens(req: any, res: Response, next: NextFunction) {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getRefreshTokens(req.params.id)
        .then(tokens => tokens ? res.json(tokens) : res.sendStatus(404))
        .catch(next);
}

// helper functions

function setTokenCookie(res: Response, token: string) {
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}