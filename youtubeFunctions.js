const {google} = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

async function getVideoById(id) {
  const videoList = await youtube.videos.list({part: 'id,snippet',id:id});
  return videoList.data.items[0];
}

module.exports = {
  getVideoById
};
