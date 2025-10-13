const http = require('http');

console.log('Probando API de usuarios...\n');

// Test 1: Health check
http.get('http://localhost:3000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Health Check:');
    console.log(data);
    console.log('\n');

    // Test 2: Obtener usuarios
    http.get('http://localhost:3000/api/usuarios', (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        console.log('📋 Obtener Usuarios:');
        console.log(data2);
        process.exit(0);
      });
    }).on('error', err => {
      console.error('❌ Error al obtener usuarios:', err.message);
      process.exit(1);
    });
  });
}).on('error', err => {
  console.error('❌ Error en health check:', err.message);
  process.exit(1);
});
