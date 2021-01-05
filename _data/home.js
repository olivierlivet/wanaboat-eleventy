
require('dotenv').config();

const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});

module.exports = function() {
  return client.getEntry('47E66HzdNcvENtKpQBrneI')
  .then(function(response) {
    const page = response
    return page;
  })
  .catch(console.error);
};
