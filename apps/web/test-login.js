const axios = require('axios');
axios.post('https://proclinic-backend.onrender.com/auth/login', {
  email: 'admin@mediflow.com',
  password: '123456'
}).then(res => console.log(res.data)).catch(err => console.error(err.response?.status, err.response?.data));
