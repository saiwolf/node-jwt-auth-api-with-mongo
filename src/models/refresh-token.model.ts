import mongoose, { Document, Schema, Model } from 'mongoose';

interface IRefreshToken {
    token: string,
    expires: Date,
    create: Date,
    createdByIp: string,
    revoked: Date,
    revokedByIp: string,
    replacedByToken: string,
    isExpired: boolean,
    isActive: boolean,
    user: Schema.Types.ObjectId
}

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    createdByIp: String,
    revoked: Date,
    revokedByIp: String,
    replacedByToken: String
});



schema.virtual('isExpired').get(function(this: IRefreshToken) {
    let nowDate = new Date(Date.now());
    return nowDate >= this.expires;
});

schema.virtual('isActive').get(function (this: IRefreshToken) {
    return !this.revoked && !this.isExpired;
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.user;
    }
});

export default mongoose.model('RefreshToken', schema);