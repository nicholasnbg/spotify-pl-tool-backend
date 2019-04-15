const querystring = require('querystring');

const queryStringify = redirect_uri => {
  return querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: 'user-read-private playlist-modify-public',
    redirect_uri
  });
};

module.exports = {queryStringify};
