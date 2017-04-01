'use strict';
require('dotenv').load();
var path = require('path');
var Joi = require('joi');
var Boom = require('boom');
var Promise = require('bluebird');
var generateHtml = require(path.join(__dirname, 'generate-html'));
var createDoc = Promise.method(require('apidoc').createDoc);

const Hapi = require('hapi');
const server = new Hapi.Server();

var epochtalkPath = process.env.EPOCHTALK_PATH;
var apiKey = process.env.API_KEY;

if (!epochtalkPath) {
  console.error('No EPOCHTALK_PATH in ENV!');
  process.exit(1);
}
else {
 epochtalkPath = path.resolve(epochtalkPath);
}
if (!apiKey) {
  console.error('No API_KEY in ENV!');
  process.exit(1);
}

server.connection({ port: 3000, host: 'localhost' });

server.route({
  method: 'POST',
  path: '/generate',
  config: {
    validate: {
      payload: Joi.object().keys({
        api_key: Joi.string().required()
      })
    },
    handler: function (request, reply) {
      if (request.payload.api_key === apiKey) {
        var opts = { src: epochtalkPath,  dest: 'doc', excludeFilters: ['node_modules', 'public'] };
        return createDoc(opts)
        .then(function() {
          return generateHtml.generate()
          .then(function(results) { reply(results); })
          .catch(function(e){ reply(Boom.badImplementation(e.message)); });
        })
        .catch(function() {
          reply(Boom.badImplementation('Error: api doc generation failed'));
        });
      }
      else { reply(Boom.unauthorized('Invalid API Key. Go fuck yourself')); }
    }
  }
});

server.start((err) => {
  if (err) { throw err; }
  console.log(`Server running at: ${server.info.uri}`);
});
