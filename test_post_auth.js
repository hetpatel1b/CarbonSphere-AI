const http = require('http');

const email = `test${Date.now()}@example.com`;

const registerData = JSON.stringify({
  name: 'Test User',
  email: email,
  password: 'password123'
});

const reqOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
};

const req = http.request(reqOptions, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Register response:', body);

    // Login
    const loginData = JSON.stringify({
      email: email,
      password: 'password123'
    });

    const loginReqOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const loginReq = http.request(loginReqOptions, loginRes => {
      let loginBody = '';
      loginRes.on('data', chunk => loginBody += chunk);
      loginRes.on('end', () => {
        console.log('Login response:', loginBody);
        const loginDataParsed = JSON.parse(loginBody);
        
        if (!loginDataParsed.token) return;

        // Post activity
        const postData = JSON.stringify({
          activityType: 'Commute',
          carbonEmission: 5,
          category: 'Transport',
          date: '2026-06-11'
        });

        const postOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/activities',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginDataParsed.token}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const postReq = http.request(postOptions, postRes => {
          console.log(`POST statusCode: ${postRes.statusCode}`);
          let postBody = '';
          postRes.on('data', d => postBody += d);
          postRes.on('end', () => {
            console.log('Post Response:', postBody);
          });
        });

        postReq.on('error', error => console.error(error));
        postReq.write(postData);
        postReq.end();

      });
    });

    loginReq.on('error', error => console.error(error));
    loginReq.write(loginData);
    loginReq.end();
  });
});

req.on('error', error => console.error(error));
req.write(registerData);
req.end();
