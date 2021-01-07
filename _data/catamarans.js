
require('dotenv').config();

const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});

module.exports = function() {
  return client.getEntry('4A30YD7j2K7y2ti3ZGxwwg')
  .then(function(response) {
    const page = response
    return page;
  })
  .catch(console.error);
};
