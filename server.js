'use strict';
require('dotenv').load();
var path = require('path');
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

const Hapi = require('hapi');
const Joi = require('joi');
const Boom = require('boom');
const apiDoc = require('apidoc');

const server = new Hapi.Server();

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
          if (apiDoc.createDoc(opts)) {
            reply('Docs Generated');
          }
          else { reply(Boom.badImplementation('Error: api doc generation failed')); }
        }
        else { reply(Boom.unauthorized('Invalid key.  Go fuck yourself')); }
      }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
