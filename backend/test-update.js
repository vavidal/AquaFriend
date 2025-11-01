const http = require('http');

console.log('Probando actualización de usuario...\n');

const data = JSON.stringify({
  nombre: 'Admin Actualizado',
  apellido: 'AquaFriend',
  email: 'admin',
  role_id: 1,
  activo: 1
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/usuarios/1',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.write(data);
req.end();
