import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import RefreshToken from '../models/refresh-token.model';

mongoose.Promise = global.Promise;

export function isValidId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

export default {
    User: UserModel,
    RefreshToken: RefreshToken,
    isValidId
}