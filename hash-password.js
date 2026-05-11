const bcrypt = require('bcryptjs');
const password = 'MHM@786';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log('PASSWORD_HASH:', hash);
