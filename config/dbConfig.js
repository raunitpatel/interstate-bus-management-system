const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.postgres_user,
    password: process.env.postgres_password,
    host: process.env.postgres_host,
    port: process.env.postgres_port,
    database: process.env.postgres_db, 
});

pool.on('connect', () => {
    console.log('connected to the db');
});
pool.on('error',()=>{
    console.log('error connecting to the db');
})

module.exports = pool;
