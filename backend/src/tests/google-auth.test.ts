import request from 'supertest';
import app from '../app';
import User from '../models/user.model';

jest.mock('../utils/googleVerify');
import { verifyGoogleIdToken } from '../utils/googleVerify';
const mockVerify = verifyGoogleIdToken as jest.Mock;

const googlePayload = {
  sub: 'google-uid-123',
  email: 'googleuser@example.com',
  email_verified: true,
  name: 'Google User',
  picture: 'https://example.com/pic.jpg',
};

describe('POST /api/auth/google — service branches', () => {
  it('creates a new user on first Google login', async () => {
    mockVerify.mockResolvedValue(googlePayload);
    const res = await request(app).post('/api/auth/google').send({ idToken: 'fake-token' });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(googlePayload.email);
    expect(res.body).toHaveProperty('token');
  });

  it('returns same user on second Google login (found by googleId)', async () => {
    mockVerify.mockResolvedValue(googlePayload);
    await request(app).post('/api/auth/google').send({ idToken: 'fake-token' });

    const res = await request(app).post('/api/auth/google').send({ idToken: 'fake-token' });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(googlePayload.email);
  });

  it('links Google account to existing email user', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'existinguser',
      email: googlePayload.email,
      password: 'password123',
    });

    mockVerify.mockResolvedValue(googlePayload);
    const res = await request(app).post('/api/auth/google').send({ idToken: 'fake-token' });
    expect(res.status).toBe(200);

    const user = await User.findOne({ email: googlePayload.email });
    expect(user?.googleId).toBe(googlePayload.sub);
  });

  it('returns 400 when Google token verification fails', async () => {
    mockVerify.mockRejectedValue(new Error('Invalid Google token'));
    const res = await request(app).post('/api/auth/google').send({ idToken: 'bad-token' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid Google token');
  });

  it('returns 400 for missing idToken', async () => {
    const res = await request(app).post('/api/auth/google').send({});
    expect(res.status).toBe(400);
  });
});
