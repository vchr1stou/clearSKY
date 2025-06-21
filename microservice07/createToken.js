// createToken.js
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    user_id: 1234,
    name: 'Test Student',
    role: 'student', // ή 'instructor'
  },
  'SaasFagame', // ή process.env.JWT_SECRET αν το έχεις φορτώσει
  { expiresIn: '1h' }
);

console.log('Generated Token:\n');
console.log(token);
