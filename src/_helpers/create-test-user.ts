import bcrypt from 'bcryptjs';
import db from './db';
import Role from './role';

export default async function createTestUser() {
    if ((await db.User.countDocuments({})) === 0) {
        const user = new db.User({
            firstName: 'Test',
            lastName: 'User',
            username: 'test',
            passwordHash: bcrypt.hashSync('test', 12),
            role: Role.Admin
        });
        await user.save();
    }
}
