/**
 * StopController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  get: async function (req, res) {
    var stops = await Stop.find().sort("id ASC");
    res.send(stops);
  }

};
