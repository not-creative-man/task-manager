import Controller from './dbTestController.js';
//import user from '../../config/db_options.js'

//const Controller = require('./dbTestController');

// await Controller.createUser({
//   email: "some@mail.com",
//   password: "some.password",
//   nickname: "man"
// });

console.log(await Controller.findByUsername("man"))

