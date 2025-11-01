const http = require('http');

console.log('Probando creación de usuario con rol...\n');

const nuevoUsuario = {
  nombre: 'María',
  apellido: 'García',
  email: 'maria.garcia@example.com',
  password: 'password123',
  role_id: 2 // Editor
};

const data = JSON.stringify(nuevoUsuario);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/usuarios',
  method: 'POST',
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
    if (responseData) {
      try {
        console.log('Parsed:', JSON.stringify(JSON.parse(responseData), null, 2));
      } catch (e) {
        console.log('No se pudo parsear JSON');
      }
    }
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.write(data);
req.end();
