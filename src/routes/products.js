const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req,res)=>{
  try{ const products = await Product.findAll(); res.json({statusCode:200, data:products}); }
  catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

router.get('/:id', async (req,res)=>{
  try{
    const product = await Product.findByPk(req.params.id);
    if(!product) return res.status(404).json({statusCode:404, error:"Producto no encontrado"});
    res.json({statusCode:200, data:product});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

router.post('/', async (req,res)=>{
  try{
    const {name,price}=req.body||{};
    if(!name||price===undefined) return res.status(400).json({statusCode:400, error:"name y price requeridos"});
    if(isNaN(price)||Number(price)<0) return res.status(400).json({statusCode:400, error:"price debe ser numero positivo"});
    const product = await Product.create({name,price});
    res.status(201).json({statusCode:201, data:product});
  }catch(e){
    if(e.name==='SequelizeValidationError') return res.status(400).json({statusCode:400, error:e.errors[0].message});
    res.status(500).json({statusCode:500, error:e.message});
  }
});

router.put('/:id', async (req,res)=>{
  try{
    const {name,price}=req.body||{};
    if(!name && price===undefined) return res.status(400).json({statusCode:400, error:"Al menos name o price"});
    const product = await Product.findByPk(req.params.id);
    if(!product) return res.status(404).json({statusCode:404, error:"Producto no encontrado"});
    if(name) product.name=name;
    if(price!==undefined) {
      if(isNaN(price)||Number(price)<0) return res.status(400).json({statusCode:400, error:"price debe ser numero positivo"});
      product.price=price;
    }
    await product.save();
    res.json({statusCode:200, data:product});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

router.delete('/:id', async (req,res)=>{
  try{
    const product = await Product.findByPk(req.params.id);
    if(!product) return res.status(404).json({statusCode:404, error:"Producto no encontrado"});
    await product.destroy();
    res.json({statusCode:200, data:{message:"Producto eliminado", id:req.params.id}});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

module.exports = router;
