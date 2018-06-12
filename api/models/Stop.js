/**
 * Stop.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: 'number',
      required: true
    },
    nameEN: {
      type: 'string',
      required: true
    },
    nameJP: {
      type: 'string',
      required: true
    },
    visible: {
      type: 'boolean',
      defaultsTo: true
    }
  },

  toJSON: function () {
    var obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
  }

};
