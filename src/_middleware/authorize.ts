import config from '../config';
import db from '../_helpers/db';
import { Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import Role from '../_helpers/role';

const secret = config.app.secret;

function authorize(roles: string | string[] = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret, algorithms: ['HS256'] }),

        async (req: any, res: Response, next: NextFunction) => {
            const user = await db.User.findById(req.user.id);

            if (!user || (roles.length && !roles.includes(user.role))) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorize' });
            }

            // authentication and authorization successful
            req.user.role = user.role;
            const refreshTokens = await db.RefreshToken.find({ user: user.id });
            req.user.ownsToken = (token: string) => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ]
}

export default authorize;