const options = {
  host: process.env.DB_HOST,
  port: 3030,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "my_db",
}

module.exports = options;

//MYSQL_ROOT_PASSWORD
//MYSQL_ALLOW_EMPTY_PASSWORD
//MYSQL_RANDOM_ROOT_PASSWORD