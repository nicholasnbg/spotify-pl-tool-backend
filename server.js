const express = require('express');
const request = require('request');
require('dotenv').config();

const {queryStringify} = require("./helpers");
const youtubeFunctions = require('./youtubeFunctions');

const app = express();
const port = 8888;

const redirect_uri = process.env.SPOTIFY_CALLBACK_URI || 'http://localhost:8888/callback';

//Allow everything cause screw CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//used for initiating authentication process for spotify account and user granting permissions
app.get('/login', (req, res) => {
  const queryParams = queryStringify(redirect_uri);
  res.send('https://accounts.spotify.com/authorize?' + queryParams)
});

//redirects back to front end with access token in query
app.get('/callback', (req, res) => {
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

// Retrieve Youtube video info
app.get('/getVideoDetails/:videoId', async (req, res) => {
  const {videoId} = req.params;
  const videoDetails = await youtubeFunctions.getVideoById(videoId);
  res.send({videoDetails});
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
});
