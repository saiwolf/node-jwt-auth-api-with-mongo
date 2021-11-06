import mongoose from 'mongoose';
import UserModel from '../users/user.model';
import RefreshToken from '../users/refresh-token.model';

mongoose.Promise = global.Promise;

export function isValidId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

export default {
    User: UserModel,
    RefreshToken: RefreshToken,
    isValidId
}