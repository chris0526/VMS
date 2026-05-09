const https = require('https');

const data = JSON.stringify({
  service_id: 'service_4aaxzl5',
  template_id: 'template_8kgpbig',
  user_id: '3ZG68utdgT3EEaqhH',
  accessToken: 'tVWfhjZ_1MVw3HhluWiX9',
  template_params: {
    to_email: 'christopherjoshva99@gmail.com',
    to_name: 'Test Guest',
    from_email: 'christopherjoshva99@gmail.com',
    message: 'Testing the new template_8kgpbig direct connection!'
  }
});

const options = {
  hostname: 'api.emailjs.com',
  port: 443,
  path: '/api/v1.0/email/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let responseBody = '';
  res.on('data', chunk => responseBody += chunk);
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response Body: ${responseBody}`);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
