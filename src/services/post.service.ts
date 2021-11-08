import ApplicationError from '../_helpers/CustomError';
import config from '../_config';
import db from '../_helpers/db';
import { Post } from '../models/post.model';
import userService from './user.service';
import { Model, Document } from 'mongoose';

export interface IPostServiceProps {
    title: string,
    createdAt: Date,
    updatedAt: Date,
    content: Date,
};

async function getAll() {
    return await db.Post.find().populate('User');    
};

async function getById(id: string) {
    return await getPost(id);
};

async function create(post: Post) {
    const user = await db.User.findById(post.author);
    if (!user) throw new ApplicationError('User for Post not found');

    return await db.Post.create({
        title: post.title,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: post.content,
        author: user._id,
    });
}

async function update(postId: string, post: Post) {
    const dbPost = await db.Post.findById(postId);
    if (!dbPost) throw new ApplicationError('Post to Update not found');
    return await db.Post.findByIdAndUpdate(postId, post, {
        new: true
    });
}

async function _delete(postId: string) {
    return await db.Post.findByIdAndRemove(postId);
}

export default {
    getAll,
    getById,
    create,
    update,
    _delete,
}

// helper functions

async function getPost(id: string) {
    if (!db.isValidId(id)) throw new ApplicationError('Post not found');
    const post = await db.Post.findById(id).populate('User');
    if (!post) throw new ApplicationError('Post not found');
    return post;
}