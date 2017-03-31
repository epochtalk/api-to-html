'use strict';

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
        var opts = { src:'../epoch-latest/epochtalk',  dest: 'doc', excludeFilters: ['node_modules'] };
        if (apiDoc.createDoc(opts)) {
          reply('Docs Generated');
        }
        else { reply(Boom.badImplementation('Error: api doc generation failed')); }
      }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
