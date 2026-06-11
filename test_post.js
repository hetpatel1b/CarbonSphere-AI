const http = require('http');

const data = JSON.stringify({
  activityType: 'Commute',
  carbonEmission: 5,
  category: 'Transport'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/activities',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
