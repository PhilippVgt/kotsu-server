module.exports = {

  friendlyName: 'KATE',
  description: 'Load departures from KATE.',

  inputs: {
    from: {
      type: 'number',
      example: 100001,
      description: 'The code of the departure bus stop.',
      required: true
    },
    to: {
      type: 'number',
      example: -14,
      description: 'The code of the destination bus stop.',
      required: true
    },
    date: {
      type: 'string',
      example: '2018-08-27',
      description: 'The date to load departures for.',
      required: true
    }
  },


  fn: async function (inputs, exits) {
    const phantom = require('phantom'),
          cheerio = require("cheerio");

    const fromStop = await Stop.findOne({code: inputs.from})
    const toStop = await Stop.findOne({code: inputs.to})
    const stops = await Stop.find();

    console.log(inputs.date + " " + fromStop.nameEN + " -> " + toStop.nameEN);

    const instance = await phantom.create();
    const page = await instance.createPage();

    const status = await page.open('http://www.kate.co.jp/timetable/detail/GK');
    const content = await page.property('content');

    await setTimeout(async function() {
      const $ = cheerio.load(content);

      var timeTable;
      if (fromStop.code == 100001 || fromStop.code == 100002) {
        timeTable = $(".timetable").eq(1);
      } else {
        timeTable = $(".timetable").eq(0);
      }

      var fromColumn = -1;
      var fromStops = $(timeTable).find(".dep_box .name");
      $(fromStops).each(function(i, elem) {
        if($(this).text().includes(fromStop.nameJP)) {
          fromColumn = i;
        }
      });

      var toColumn = -1;
      var toStops = $(timeTable).find(".arr_box .name");
      $(toStops).each(function(i, elem) {
        if($(this).text().includes(toStop.nameJP)) {
          toColumn = fromStops.length + i;
        }
      });

      if(fromColumn < 0 || toColumn < 0) {
        console.log("No departures");
        await Loaded.create({origin: fromStop.id, destination: toStop.id, date: inputs.date});
        return exits.success([]);
      }

      const fare = $(".fare_area").first().text().replace(/\D/g,"");

      var departures = []

      var i = 0;
      $(timeTable).find(".time").each(function(index, elem) {
        if($(this).children().eq(fromColumn + 1).text() == '') return true;

        departures[i] = {};
        departures[i]["origin"] = fromStop.id;
        departures[i]["destination"] = toStop.id;
        departures[i]["terminal"] = toStop.id;

        departures[i]["date"] = inputs.date;

        var timeParts = $(this).children().eq(fromColumn + 1).text().split(":");
        var departureTime = new Date(inputs.date);
        departureTime.setHours(timeParts[0]);
        departureTime.setMinutes(timeParts[1]);
        departures[i]["hours"] = timeParts[0];
        departures[i]["minutes"] = timeParts[1];

        timeParts = $(this).children().eq(toColumn + 1).text().split(":");
        var arrivalTime = new Date(inputs.date);
        arrivalTime.setHours(timeParts[0]);
        arrivalTime.setMinutes(timeParts[1]);

        departures[i]["line"] = $(this).children(".company").first().text();
        departures[i]["platform"] = 0;
        departures[i]["duration"] = (arrivalTime.getTime() - departureTime.getTime()) / (1000*60);
        departures[i]["fare"] = fare;

        i++;
      });

      console.log(departures.length + " departures loaded");
      await Departure.createEach(departures);
      await Loaded.create({origin: fromStop.id, destination: toStop.id, date: inputs.date});
      departures = await Departure.find({origin: fromStop.id, destination: toStop.id, date: inputs.date})
                                      .populate('origin').populate('destination')
                                      .populate('terminal').populate('via');
      return exits.success(departures);
    }, 1000);

    await instance.exit();
  }
};
