/**
 * Departure.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    origin: {
      model: 'stop',
      required: true
    },
    destination: {
      model: 'stop',
      required: true
    },
    terminal: {
      model: 'stop'
    },
    via: {
      model: 'stop'
    },
    date: {
      type: 'string',
      required: true
    },
    hours: {
      type: 'number',
      required: true
    },
    minutes: {
      type: 'number',
      required: true
    },
    line: {
      type: 'string',
      defaultsTo: ''
    },
    platform: {
      type: 'number',
      defaultsTo: 0
    },
    duration: {
      type: 'number',
      defaultsTo: 0
    },
    fare: {
      type: 'number',
      defaultsTo: 0
    },
  },

};
