import request from 'supertest';
import app from '../app';
import { createUserWithRole } from './helpers';

const imageData = {
  title: 'Test Tattoo',
  imageUrl: 'https://example.com/tattoo.jpg',
};

describe('GET /api/gallery', () => {
  it('is publicly accessible', async () => {
    const res = await request(app).get('/api/gallery');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/gallery', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app).post('/api/gallery').send(imageData);
    expect(res.status).toBe(401);
  });

  it('returns 403 for customer', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${token}`)
      .send(imageData);
    expect(res.status).toBe(403);
  });

  it('admin can upload image', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${token}`)
      .send(imageData);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(imageData.title);
    expect(res.body).not.toHaveProperty('__v');
  });

  it('artist can upload image', async () => {
    const { token } = await createUserWithRole('artist');
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${token}`)
      .send(imageData);
    expect(res.status).toBe(201);
  });

  it('returns 400 for invalid image URL', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', imageUrl: 'not-a-url' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/gallery/:id', () => {
  it('admin can delete image', async () => {
    const { token } = await createUserWithRole('admin');
    const upload = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${token}`)
      .send(imageData);

    const res = await request(app)
      .delete(`/api/gallery/${upload.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it('artist cannot delete image', async () => {
    const { token: adminToken } = await createUserWithRole('admin');
    const { token: artistToken } = await createUserWithRole('artist', '2');

    const upload = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(imageData);

    const res = await request(app)
      .delete(`/api/gallery/${upload.body.id}`)
      .set('Authorization', `Bearer ${artistToken}`);
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent image', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .delete('/api/gallery/000000000000000000000001')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
