const request = require('supertest');
const { app, sequelize, Product } = require('../src/app');

beforeAll(async ()=>{
  await sequelize.sync({ force: true });
});

afterAll(async ()=>{
  await sequelize.close();
});

describe('API Products', ()=>{
  let productId;
  test('POST /api/products crea', async ()=>{
    const res = await request(app).post('/api/products').send({name:"Laptop", price:15000});
    expect(res.statusCode).toBe(201);
    productId=res.body.data.id;
  });
  test('POST /api/products falla sin price', async ()=>{
    const res = await request(app).post('/api/products').send({name:"Sin precio"});
    expect(res.statusCode).toBe(400);
  });
  test('POST /api/products falla price negativo', async ()=>{
    const res = await request(app).post('/api/products').send({name:"Mal", price:-5});
    expect(res.statusCode).toBe(400);
  });
  test('GET /api/products lista', async ()=>{
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });
  test('GET /api/products/:id exito', async ()=>{
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
  });
  test('GET /api/products/:id falla 404', async ()=>{
    const res = await request(app).get('/api/products/99999');
    expect(res.statusCode).toBe(404);
  });
  test('PUT /api/products/:id actualiza', async ()=>{
    const res = await request(app).put(`/api/products/${productId}`).send({price:20000});
    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(20000);
  });
  test('PUT /api/products/:id falla price negativo', async ()=>{
    const res = await request(app).put(`/api/products/${productId}`).send({price:-1});
    expect(res.statusCode).toBe(400);
  });
  test('DELETE /api/products/:id elimina', async ()=>{
    const p = await Product.create({name:"Borrar", price:10});
    const res = await request(app).delete(`/api/products/${p.id}`);
    expect(res.statusCode).toBe(200);
  });
});
