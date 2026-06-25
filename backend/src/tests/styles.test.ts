import request from 'supertest';
import app from '../app';
import { createUserWithRole } from './helpers';

const styleData = { name: 'Blackwork', description: 'Bold black ink designs' };

describe('GET /api/styles', () => {
  it('is publicly accessible', async () => {
    const res = await request(app).get('/api/styles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/styles', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app).post('/api/styles').send(styleData);
    expect(res.status).toBe(401);
  });

  it('returns 403 for customer', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .post('/api/styles')
      .set('Authorization', `Bearer ${token}`)
      .send(styleData);
    expect(res.status).toBe(403);
  });

  it('admin can create style', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .post('/api/styles')
      .set('Authorization', `Bearer ${token}`)
      .send(styleData);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(styleData.name);
  });

  it('returns 400 for missing name', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .post('/api/styles')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'no name' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/styles/:id', () => {
  it('admin can update style', async () => {
    const { token } = await createUserWithRole('admin');
    const created = await request(app)
      .post('/api/styles')
      .set('Authorization', `Bearer ${token}`)
      .send(styleData);

    const res = await request(app)
      .put(`/api/styles/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Updated description' });
    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Updated description');
  });

  it('returns 403 for artist', async () => {
    const { token: adminToken } = await createUserWithRole('admin');
    const { token: artistToken } = await createUserWithRole('artist', '2');
    const created = await request(app)
      .post('/api/styles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(styleData);

    const res = await request(app)
      .put(`/api/styles/${created.body.id}`)
      .set('Authorization', `Bearer ${artistToken}`)
      .send({ description: 'Hack' });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/styles/:id', () => {
  it('admin can delete style', async () => {
    const { token } = await createUserWithRole('admin');
    const created = await request(app)
      .post('/api/styles')
      .set('Authorization', `Bearer ${token}`)
      .send(styleData);

    const res = await request(app)
      .delete(`/api/styles/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).delete('/api/styles/000000000000000000000001');
    expect(res.status).toBe(401);
  });
});
