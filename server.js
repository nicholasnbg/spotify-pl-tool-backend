const express = require('express');
const querystring = require('querystring');
const request = require('request');
var cors = require('cors')
require('dotenv').config();

const app = express();
const port = 8888;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const redirect_uri = 'http://localhost:8888/callback';

app.get('/login', (req, res) => {
  console.log("login hit");
  const stringify = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: 'user-read-private playlist-modify-public',
    redirect_uri
  });
  res.send('https://accounts.spotify.com/authorize?' +
      stringify)
});

app.get('/callback', (req, res) => {
  console.log('callback hit');
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    const access_token = body.access_token;
    const uri = process.env.FRONTEND_URI || 'http://localhost:3000';
    res.redirect(uri + '?access_token=' + access_token)
  })
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
});
