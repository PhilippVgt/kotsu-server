/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'get /departure/:from/:to/:date': 'DepartureController.get',
  'get /connection': 'DepartureController.mesh',
  'get /stop': 'StopController.get'

};
