const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req,res)=>{
  try{ const users = await User.findAll(); res.json({statusCode:200, data:users}); }
  catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

router.get('/:id', async (req,res)=>{
  try{
    const user = await User.findByPk(req.params.id);
    if(!user) return res.status(404).json({statusCode:404, error:"Usuario no encontrado"});
    res.json({statusCode:200, data:user});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

router.post('/', async (req,res)=>{
  try{
    const {name,email}=req.body||{};
    if(!name||!email) return res.status(400).json({statusCode:400, error:"name y email requeridos"});
    const user = await User.create({name,email});
    res.status(201).json({statusCode:201, data:user});
  }catch(e){ 
    if(e.name==='SequelizeValidationError') return res.status(400).json({statusCode:400, error:e.errors[0].message});
    res.status(500).json({statusCode:500, error:e.message}); 
  }
});

router.put('/:id', async (req,res)=>{
  try{
    const {name,email}=req.body||{};
    if(!name && !email) return res.status(400).json({statusCode:400, error:"Al menos name o email para actualizar"});
    const user = await User.findByPk(req.params.id);
    if(!user) return res.status(404).json({statusCode:404, error:"Usuario no encontrado"});
    if(name) user.name=name;
    if(email) user.email=email;
    await user.save();
    res.json({statusCode:200, data:user});
  }catch(e){
    if(e.name==='SequelizeValidationError') return res.status(400).json({statusCode:400, error:e.errors[0].message});
    res.status(500).json({statusCode:500, error:e.message});
  }
});

router.delete('/:id', async (req,res)=>{
  try{
    const user = await User.findByPk(req.params.id);
    if(!user) return res.status(404).json({statusCode:404, error:"Usuario no encontrado"});
    await user.destroy();
    res.json({statusCode:200, data:{message:"Usuario eliminado", id:req.params.id}});
  }catch(e){ res.status(500).json({statusCode:500, error:e.message}); }
});

module.exports = router;
