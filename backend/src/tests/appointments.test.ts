import request from 'supertest';
import app from '../app';
import TattooStyle from '../models/tattooStyle.model';
import { createUserWithRole } from './helpers';

let styleId: string;

beforeEach(async () => {
  const style = await TattooStyle.create({ name: 'Traditional', description: 'Classic' });
  styleId = String(style._id);
});

const futureDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

describe('GET /api/appointments', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(401);
  });

  it('returns empty array for new customer', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('admin sees all appointments', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '10:00' });

    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe('POST /api/appointments', () => {
  it('customer creates appointment with status pending', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '10:00' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
  });

  it('returns 400 for past date', async () => {
    const { token } = await createUserWithRole('customer');
    const pastDate = new Date(Date.now() - 1000).toISOString();
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ tattooStyle: styleId, appointmentDate: pastDate, timeSlot: '10:00' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid timeSlot format', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '10h00' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid tattooStyle ID', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ tattooStyle: 'invalid-id', appointmentDate: futureDate(), timeSlot: '10:00' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/appointments/:id/confirm', () => {
  it('admin can confirm a pending appointment', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '11:00' });

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });

  it('customer cannot confirm appointment', async () => {
    const { token } = await createUserWithRole('customer');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '12:00' });

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/confirm`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/appointments/:id/cancel', () => {
  it('customer can cancel own appointment', async () => {
    const { token } = await createUserWithRole('customer');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '09:00' });

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelled');
  });
});

describe('PATCH /api/appointments/:id/complete', () => {
  it('admin can complete a confirmed appointment', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '14:00' });

    await request(app)
      .patch(`/api/appointments/${created.body.id}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/complete`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  it('customer cannot complete appointment', async () => {
    const { token } = await createUserWithRole('customer');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '15:00' });

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/complete`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/appointments/:id', () => {
  it('admin can update appointment notes', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '16:00' });

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ artistNotes: 'Bring reference photos' });
    expect(res.status).toBe(200);
    expect(res.body.artistNotes).toBe('Bring reference photos');
  });
});

describe('GET /api/appointments — artist role', () => {
  it('artist sees appointments assigned to them', async () => {
    const { token } = await createUserWithRole('artist');
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/appointments/booked-slots', () => {
  it('returns booked slots for a valid month', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .get('/api/appointments/booked-slots?month=2027-06')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('returns 400 for invalid month format', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .get('/api/appointments/booked-slots?month=invalid')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('returns 400 when month param is missing', async () => {
    const { token } = await createUserWithRole('customer');
    const res = await request(app)
      .get('/api/appointments/booked-slots')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe('appointment status transition error cases', () => {
  it('cannot confirm an already confirmed appointment', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '17:00' });

    await request(app)
      .patch(`/api/appointments/${created.body.id}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });

  it('customer cannot cancel another customers appointment → 403', async () => {
    const { token: c1Token } = await createUserWithRole('customer');
    const { token: c2Token } = await createUserWithRole('customer', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${c1Token}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '18:00' });

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/cancel`)
      .set('Authorization', `Bearer ${c2Token}`);
    expect(res.status).toBe(403);
  });

  it('customer cannot cancel a confirmed appointment', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '19:00' });

    await request(app)
      .patch(`/api/appointments/${created.body.id}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(400);
  });

  it('cannot complete a pending (non-confirmed) appointment', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ tattooStyle: styleId, appointmentDate: futureDate(), timeSlot: '20:00' });

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/complete`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });

  it('completing appointment with referenceImageUrl auto-creates gallery entry', async () => {
    const { token: customerToken } = await createUserWithRole('customer');
    const { token: adminToken } = await createUserWithRole('admin', '2');

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        tattooStyle: styleId,
        appointmentDate: futureDate(),
        timeSlot: '21:00',
        referenceImageUrl: 'https://example.com/ref.jpg',
      });

    await request(app)
      .patch(`/api/appointments/${created.body.id}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);

    const res = await request(app)
      .patch(`/api/appointments/${created.body.id}/complete`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');

    const gallery = await request(app).get('/api/gallery');
    expect(gallery.body.some((img: { imageUrl: string }) => img.imageUrl === 'https://example.com/ref.jpg')).toBe(true);
  });
});
