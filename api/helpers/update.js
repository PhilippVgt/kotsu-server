module.exports = {

  friendlyName: 'Update',
  description: 'Load all missing departures for the next 10 days.',

  fn: async function (inputs, exits) {
    const stops = await Stop.find();

    for(var i = 0; i < 10; i++) {
      var currentTime = new Date();
      currentTime.setDate(currentTime.getDate() + i);
      const date = currentTime.toISOString().substring(0, 10);

      var countKotsu = 0;
      var countKate = 0;
      var unloaded = 0;

      for(const fromStop of stops) {
        for(const toStop of stops) {
          if (fromStop.code == toStop.code) {
            continue;
          }

          const loaded = await Loaded.find({origin: fromStop.id, destination: toStop.id, date: date});
          if(loaded.length == 0) {
            unloaded ++;
            if(fromStop.code == 100001 || fromStop.code == 100002 || toStop.code == 100001 || toStop.code == 100002) {
              var departures = await sails.helpers.kate.with({from: fromStop.code, to: toStop.code, date: date});
              if(departures) {
                countKate += departures.length;
              }
            } else {
              var departures = await sails.helpers.kotsu.with({from: fromStop.code, to: toStop.code, date: date});
              if(departures) {
                countKotsu += departures.length;
              }
            }
          } else {
            console.log(date + " " + fromStop.nameEN + " -> " + toStop.nameEN + " already loaded");
          }

        }
      }

      if(unloaded > 0) {
        await sails.helpers.email.with({kotsu: countKotsu, kate: countKate, date: date});
      }
    }

    return exits.success();
  }

};
