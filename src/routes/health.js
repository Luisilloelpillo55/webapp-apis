const express = require('express');
const router = express.Router();
const { User, Product } = require('../app');
const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

router.get('/health', (req,res)=>{
  res.json({statusCode:200, data:{status:"ok", uptime: process.uptime()}});
});

router.get('/stats', async (req,res)=>{
  try{
    const users = await require('../models/user').count();
    const products = await require('../models/product').count();
    res.json({statusCode:200, data:{users, products}});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

router.post('/backup', async (req,res)=>{
  try{
    const src = process.env.NODE_ENV==='test' ? path.join(__dirname,'../../data/database-test.sqlite') : path.join(__dirname,'../../data/database.sqlite');
    const dest = path.join(__dirname,'../../backups/backup-'+Date.now()+'.sqlite');
    if(fs.existsSync(src)) fs.copyFileSync(src,dest);
    res.json({statusCode:200, data:{message:"Backup creado", file: dest}});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

router.delete('/database/empty', async (req,res)=>{
  try{
    await require('../models/user').destroy({where:{}});
    await require('../models/product').destroy({where:{}});
    res.json({statusCode:200, data:{message:"Base de datos vaciada"}});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

module.exports = router;
