const request = require('supertest');
const { app, sequelize } = require('../src/app');

beforeAll(async ()=>{ await sequelize.sync({ force: true }); });
afterAll(async ()=>{ await sequelize.close(); });

describe('Health y Utils', ()=>{
  test('GET / debe regresar 200', async ()=>{
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
  test('GET /api/health', async ()=>{
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
  });
  test('GET /api/stats', async ()=>{
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('users');
  });
  test('POST /api/backup', async ()=>{
    const res = await request(app).post('/api/backup');
    expect(res.statusCode).toBe(200);
  });
  test('DELETE /api/database/empty', async ()=>{
    const res = await request(app).delete('/api/database/empty');
    expect(res.statusCode).toBe(200);
  });
});
