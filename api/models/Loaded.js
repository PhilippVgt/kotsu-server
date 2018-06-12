/**
 * Loaded.js
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
    date: {
      type: 'string',
      required: true
    }
  },

};
