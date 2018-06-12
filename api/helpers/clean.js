module.exports = {

  friendlyName: 'Clean',
  description: 'Remove departures on past days from the database.',

  fn: async function (inputs, exits) {
    for(var i = 1; i < 10; i++) {
      var currentTime = new Date();
      currentTime.setDate(currentTime.getDate() - i);
      const date = currentTime.toISOString().substring(0, 10);

      var departures = await Departure.destroy({date: date}).fetch();
      var cleaned = await Loaded.destroy({date: date}).fetch();
      if(cleaned.length > 0 || departures.length > 0) {
        console.log("Removed " + departures.length + " departures for " + date);
      }
    }

    return exits.success();
  }

};
