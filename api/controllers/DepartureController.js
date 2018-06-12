/**
 * DepartureController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  get: async function (req, res) {
    var fromStop = await Stop.findOne({code: req.param('from')});
    var toStop = await Stop.findOne({code: req.param('to')});
    var date = req.param('date');

    const loaded = await Loaded.find({origin: fromStop.id, destination: toStop.id, date: date});
    var departures = await Departure.find({origin: fromStop.id, destination: toStop.id, date: date})
                                    .populate('origin').populate('destination')
                                    .populate('terminal').populate('via');
    if(departures.length == 0 && loaded.length == 0) {
      if(fromStop.code == 100001 || fromStop.code == 100002 || toStop.code == 100001 || toStop.code == 100002) {
        departures = await sails.helpers.kate.with({from: fromStop.code, to: toStop.code, date: date});
      } else {
        departures = await sails.helpers.kotsu.with({from: fromStop.code, to: toStop.code, date: date});
      }
    }
    res.send(departures);
  }

};
