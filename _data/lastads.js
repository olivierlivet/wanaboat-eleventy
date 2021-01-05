
require('dotenv').config();

const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});

module.exports = function() {
  return client.getEntries({ content_type: 'ad', order: '-sys.createdAt', limit: 6 })
  .then(function(response) {
    const page = response.items
    .map(function(page) {
      page.fields.date= new Date(page.sys.updatedAt);
      return page.fields;
    });
    return page;
  })
  .catch(console.error);
};
