
require('dotenv').config();

const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});

module.exports = function() {
  return client.getEntries({
    content_type: 'model',
    order: 'fields.name',
    limit: 100,
    "fields.refUnivers.sys.id": '4A30YD7j2K7y2ti3ZGxwwg'
  })
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
