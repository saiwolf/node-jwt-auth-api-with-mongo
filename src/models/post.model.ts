import mongoose, { Document, Schema } from 'mongoose';

export interface Post {
    id?: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    content: string,
    author: Schema.Types.ObjectId,
};

const schema: Schema = new Schema<Post>({
    title: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date(Date.now()) },
    updatedAt: { type: Date, required: false, default: null },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model<Post>('Post', schema);