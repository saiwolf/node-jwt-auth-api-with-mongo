declare global {
    module 'express' {
        export interface Request {
            post: import("./src/models/post.model").Post;
            user: import("./src/models/user.model").User;
        }
    }
}