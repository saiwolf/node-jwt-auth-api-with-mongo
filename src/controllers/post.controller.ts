import config from '../_config';
import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import validateRequest from '../_middleware/validate-request';
import authorize from '../_middleware/authorize';
import Role from '../_helpers/role';
import postService from '../services/post.service';
import { Post } from '../models/post.model';

const router = express.Router();

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), postSchema, create);
router.patch('/:id', authorize(), postSchema, update);
router.delete('/:id', authorize(), _delete);

export default router;

// helpers


function postSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().required(),
        createdAt: Joi.date().required(),
        updatedAt: Joi.date(),
        content: Joi.string().required(),
        author: Joi.string().required(),
    });
    validateRequest(req, next, schema);
};

function getAll(req: Request, res: Response, next: NextFunction) {
    postService.getAll()
        .then(posts => res.json(posts))
        .catch(next);
};

function getById(req: any, res: Response, next: NextFunction) {
    // regular users can get their own posts and admins can get any post
    if (req.params.id !== req.post.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    postService.getById(req.params.id)
        .then(post => post ? res.json(post) : res.sendStatus(404))
        .catch(next);
}

function create(req: any, res: Response, next: NextFunction) {
    const newPost: Post = req.post;
    postService.create(newPost)
        .then(post => {
            res.setHeader('Location', `${config.app.api_url}/api/v1/posts/${post._id}`);
            res.sendStatus(201).end();
        })
        .catch(next);
}

function update(req: any, res: Response, next: NextFunction) {
    postService.update(req.post.id, req.post)
        .then(post => res.status(200).json(post))
        .catch(next);
}

function _delete(req: any, res: Response, next: NextFunction) {
    postService._delete(req.params.id)
        .then(_ => res.status(204).end())
        .catch(next);
}