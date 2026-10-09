const request = require('supertest');
const { app, sequelize, User, Product } = require('../src/app');

beforeAll(async ()=>{
  await sequelize.sync({ force: true });
});

afterAll(async ()=>{
  await sequelize.close();
});

describe('API Users', ()=>{
  let userId;
  test('POST /api/users crea usuario', async ()=>{
    const res = await request(app).post('/api/users').send({name:"Luis Olascoaga", email:"luis@test.com"});
    expect(res.statusCode).toBe(201);
    userId=res.body.data.id;
  });
  test('POST /api/users falla sin email', async ()=>{
    const res = await request(app).post('/api/users').send({name:"Sin Email"});
    expect(res.statusCode).toBe(400);
  });
  test('POST /api/users falla email invalido', async ()=>{
    const res = await request(app).post('/api/users').send({name:"Test", email:"mal"});
    expect(res.statusCode).toBe(400);
  });
  test('GET /api/users lista', async ()=>{
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
  test('GET /api/users/:id exito', async ()=>{
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
  });
  test('GET /api/users/:id falla 404', async ()=>{
    const res = await request(app).get('/api/users/99999');
    expect(res.statusCode).toBe(404);
  });
  test('PUT /api/users/:id actualiza', async ()=>{
    const res = await request(app).put(`/api/users/${userId}`).send({name:"Luis Actualizado"});
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Luis Actualizado");
  });
  test('PUT /api/users/:id falla body vacio', async ()=>{
    const res = await request(app).put(`/api/users/${userId}`).send({});
    expect(res.statusCode).toBe(400);
  });
  test('PUT /api/users/:id falla no existe', async ()=>{
    const res = await request(app).put('/api/users/99999').send({name:"No"});
    expect(res.statusCode).toBe(404);
  });
  test('DELETE /api/users/:id elimina', async ()=>{
    const u = await User.create({name:"Borrar", email:"borrar@test.com"});
    const res = await request(app).delete(`/api/users/${u.id}`);
    expect(res.statusCode).toBe(200);
  });
  test('DELETE /api/users/:id falla 404', async ()=>{
    const res = await request(app).delete('/api/users/99999');
    expect(res.statusCode).toBe(404);
  });
});
