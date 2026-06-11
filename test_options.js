const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/activities',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
  }
};

const req = http.request(options, res => {
  console.log(`OPTIONS statusCode: ${res.statusCode}`);
  console.log('Headers:', res.headers);
});

req.on('error', error => console.error(error));
req.end();
