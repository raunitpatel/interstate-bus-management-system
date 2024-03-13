const express = require('express');
require('dotenv').config();
const db = require('./config/dbConfig');
const userRoute = require('./routes/userRoute');
const busRoute = require('./routes/busesRoute');

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/buses', busRoute);


app.listen(port, () => {
  console.log(`Node server is running on port ${port}`);
});

