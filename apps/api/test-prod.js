const axios = require('axios');

async function testBackend() {
  console.log('Testing Proclinic Production Backend...');
  
  try {
    const res = await axios.post('https://proclinic-backend.onrender.com/auth/login', {
      email: 'admin@mediflow.com',
      password: '123456'
    });
    console.log('LOGIN SUCCESS! Status:', res.status);
    console.log('Token received:', res.data.access_token ? 'YES' : 'NO');
  } catch (err) {
    console.error('LOGIN FAILED!');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error('Network Error:', err.message);
    }
  }
}

testBackend();
