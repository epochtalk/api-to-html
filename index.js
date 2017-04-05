'use strict';
require('dotenv').load();
var path = require('path');
var Promise = require('bluebird');
var generateHtml = require(path.join(__dirname, 'generate-html'));
var createDoc = Promise.method(require('apidoc').createDoc);
var epochtalkPath = process.env.EPOCHTALK_PATH;

var opts = { src: epochtalkPath,  dest: 'doc', excludeFilters: [__dirname, 'node_modules', 'public'] };

return createDoc(opts)
.then(function() {
  return generateHtml.generate()
  .then(function(results) { console.log(results); })
  .catch(function(e){ console.log('Error:', e.message); });
})
.catch(function() {
  console.log('Error: api doc generation failed');
});
