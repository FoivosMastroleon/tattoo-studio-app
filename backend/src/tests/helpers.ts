import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const createUserWithRole = async (
  role: 'admin' | 'artist' | 'customer',
  suffix = ''
) => {
  const password = await bcrypt.hash('password123', 10);
  const user = await User.create({
    username: `${role}${suffix}`,
    email: `${role}${suffix}@test.com`,
    password,
    role,
  });
  const token = jwt.sign({ userId: user._id, role }, JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};
