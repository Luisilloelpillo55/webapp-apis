const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/user');
const Product = require('./models/product');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api', require('./routes/health'));

app.get('/', (req,res)=>{
  res.json({
    statusCode:200,
    data:{
      message:"WebApp API funcionando - CI/CD",
      version:"1.0.0",
      endpoints: ["/api/health","/api/users","/api/products","/api/stats","/api/backup"],
      tcp_port: 6061
    }
  });
});

module.exports = { app, sequelize, User, Product };
