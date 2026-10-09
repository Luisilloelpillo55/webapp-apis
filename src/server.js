const { app, sequelize } = require('./app');
const net = require('net');
const User = require('./models/user');
const Product = require('./models/product');

const HTTP_PORT = process.env.PORT || 80;
const TCP_PORT = process.env.TCP_PORT || 6061;

async function start() {
  try {
    await sequelize.sync({ alter: true });
    console.log('DB sincronizada');
  } catch(e){ console.error('Error DB', e.message); }

  if (require.main === module) {
    app.listen(HTTP_PORT, '0.0.0.0', ()=>console.log(`HTTP en ${HTTP_PORT}`));
    tcpServer.listen(TCP_PORT, '0.0.0.0', ()=>console.log(`TCP Socket en ${TCP_PORT}`));
  }
}

// TCP Server con formato {insert:<json>} {get:<element>}
const tcpServer = net.createServer((socket)=>{
  socket.write(JSON.stringify({statusCode:200, message:"Conectado TCP 6061. Usa {insert:<json>} o {get:users|products}"})+"\n");
  let buffer='';
  socket.on('data', async (data)=>{
    buffer+=data.toString();
    let lines=buffer.split('\n');
    buffer=lines.pop();
    for(let line of lines){
      line=line.trim(); if(!line) continue;
      try{
        const insertMatch = line.match(/^\{insert:(.*)\}$/);
        const getMatch = line.match(/^\{get:(.*)\}$/);
        let result;
        if(insertMatch){
          const payload = JSON.parse(insertMatch[1]);
          let type = (payload.type||'').toLowerCase();
          if(!type){
            if(payload.email) type='users';
            else if(payload.price!==undefined) type='products';
            else type='users';
          }
          if(type==='users' || type==='user'){
            if(!payload.name||!payload.email) throw new Error('users requiere name y email');
            const row = await User.create({name:payload.name, email:payload.email});
            result={statusCode:201, action:'insert', element:'users', data:row};
          }else{
            if(!payload.name||payload.price===undefined) throw new Error('products requiere name y price');
            const row = await Product.create({name:payload.name, price:payload.price});
            result={statusCode:201, action:'insert', element:'products', data:row};
          }
        } else if(getMatch){
          let raw = getMatch[1].trim();
          let pj=null; try{pj=JSON.parse(raw);}catch(e){}
          let type='users', id=null;
          if(pj){ type=(pj.type||pj.element||'users').toLowerCase(); id=pj.id||null; }
          else { type=raw.replace(/^[\"']|[\"']$/g,'').toLowerCase(); }
          if(type==='user') type='users';
          if(type==='product') type='products';
          if(type==='users'){
            if(id){ const row=await User.findByPk(id); result={statusCode:200, action:'get', element:'users', data:row}; }
            else { const rows=await User.findAll(); result={statusCode:200, action:'get', element:'users', data:rows}; }
          } else {
            if(id){ const row=await Product.findByPk(id); result={statusCode:200, action:'get', element:'products', data:row}; }
            else { const rows=await Product.findAll(); result={statusCode:200, action:'get', element:'products', data:rows}; }
          }
        } else { throw new Error('Formato invalido. Usa {insert:<json>} o {get:<element>}'); }
        socket.write(JSON.stringify(result)+"\n");
      }catch(err){
        socket.write(JSON.stringify({statusCode:400, error:err.message, received:line})+"\n");
      }
    }
  });
});

start();

module.exports = { app, tcpServer, sequelize };
