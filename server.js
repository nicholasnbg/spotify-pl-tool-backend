const express = require('express');
const querystring = require('querystring');
const dotenv = require('dotenv');

const app = express();
const port = 8888;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
});
