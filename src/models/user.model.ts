import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUserProps {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    passwordHash: string,
    role: string,
}

const schema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: Document, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

export default mongoose.model('User', schema);

