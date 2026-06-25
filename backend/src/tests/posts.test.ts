import request from 'supertest';
import app from '../app';
import { createUserWithRole } from './helpers';

const postData = {
  title: 'New Flash Event',
  content: 'Come visit us this Saturday for our flash tattoo event!',
};

describe('GET /api/posts', () => {
  it('is publicly accessible', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/posts', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app).post('/api/posts').send(postData);
    expect(res.status).toBe(401);
  });

  it('returns 403 for customer', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);
    expect(res.status).toBe(403);
  });

  it('returns 403 for artist', async () => {
    const { token } = await createUserWithRole('artist');
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);
    expect(res.status).toBe(403);
  });

  it('admin can create post', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(postData.title);
    expect(res.body.content).toBe(postData.content);
  });

  it('returns 400 for missing title', async () => {
    const { token } = await createUserWithRole('admin');
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'some content' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/posts/:id', () => {
  it('admin can update post', async () => {
    const { token } = await createUserWithRole('admin');
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);

    const res = await request(app)
      .put(`/api/posts/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('returns 403 for customer', async () => {
    const { token: adminToken } = await createUserWithRole('admin');
    const { token: customerToken } = await createUserWithRole('customer', '2');
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(postData);

    const res = await request(app)
      .put(`/api/posts/${created.body.id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ title: 'Hacked' });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('admin can delete post', async () => {
    const { token } = await createUserWithRole('admin');
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);

    const res = await request(app)
      .delete(`/api/posts/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).delete('/api/posts/000000000000000000000001');
    expect(res.status).toBe(401);
  });
});
