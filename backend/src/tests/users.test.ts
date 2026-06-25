import request from 'supertest';
import app from '../app';
import { createUserWithRole } from './helpers';

describe('GET /api/users', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('returns 403 for customer', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('admin can get all users', async () => {
    const { token } = await createUserWithRole('admin');
    await createUserWithRole('customer', '2');
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });
});

describe('GET /api/users/:id', () => {
  it('admin can get user by id', async () => {
    const { token: adminToken } = await createUserWithRole('admin');
    const { user } = await createUserWithRole('customer', '2');

    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('customer2@test.com');
  });

  it('returns 404 for non-existent user', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .get('/api/users/000000000000000000000001')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/users/:id', () => {
  it('admin can update user', async () => {
    const { token: adminToken } = await createUserWithRole('admin');
    const { user } = await createUserWithRole('customer', '2');

    const res = await request(app)
      .patch(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'artist' });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('artist');
  });

  it('returns 403 for artist', async () => {
    const { token: artistToken } = await createUserWithRole('artist');
    const { user } = await createUserWithRole('customer', '2');

    const res = await request(app)
      .patch(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${artistToken}`)
      .send({ role: 'admin' });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/users/:id', () => {
  it('admin can delete user', async () => {
    const { token: adminToken } = await createUserWithRole('admin');
    const { user } = await createUserWithRole('customer', '2');

    const res = await request(app)
      .delete(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).delete('/api/users/000000000000000000000001');
    expect(res.status).toBe(401);
  });
});
