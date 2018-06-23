module.exports = {

  friendlyName: 'Nara Kotsu',
  description: 'Load departures from Nara Kotsu.',

  inputs: {
    from: {
      type: 'number',
      example: 560,
      description: 'The code of the departure bus stop.',
      required: true
    },
    to: {
      type: 'number',
      example: 2610,
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

    const status = await page.open('https://navi.narakotsu.co.jp/result_timetable/?stop1=' + inputs.from + '&stop2=' + inputs.to + '&date=' + inputs.date);

    await setTimeout(async function() {
      const content = await page.property('content');
      await instance.exit();

      const $ = cheerio.load(content);

      const destinations = $(".destination").first().children();
      const platforms = $(".platform").first().children();
      const durations = $(".required").first().children();
      const fares = $(".fare").first().children();

      var departures = []

      $(".minutes").each(function(i, elem) {
        departures[i] = {};
        departures[i]["origin"] = fromStop.id;
        departures[i]["destination"] = toStop.id;

        departures[i]["date"] = inputs.date;
        departures[i]["hours"] = $(this).parent().siblings('.timezone_link').text();
        departures[i]["minutes"] = $(this).text();

        const column = $(this).parent().index()
        departures[i]["line"] = $(destinations).eq(column).children(".indicator_no").first().text();
        const platform = $(platforms).eq(column).text().replace(/\D/g,"");
        departures[i]["platform"] = platform.length > 0 ? platform : 0
        departures[i]["duration"] = $(durations).eq(column).text().replace(/\D/g,"");

        const destinationName = $(destinations).eq(column).children().eq(1).text();
        const destinationStop = stops.filter(stop => destinationName.includes(stop.nameJP))[0];
        if(destinationStop === undefined) {
          departures[i]["terminal"] = toStop.id;
        } else {
          departures[i]["terminal"] = destinationStop.id;
        }

        if($(destinations).eq(column).children(".via").length > 0) {
          const viaName = $(destinations).eq(column).children(".via").first().text();
          const viaStop = stops.filter(stop => viaName.includes(stop.nameJP))[0];
          if(viaStop !== undefined) {
            departures[i]["via"] = viaStop.id;
          }
        }

        if($(fares).eq(column).find("a").length > 0) {
          departures[i]["fare"] = $(fares).eq(column).find("a").first().text().replace(/\D/g,"");
        } else {
          departures[i]["fare"] = $(fares).eq(column).text().replace(/\D/g,"");
        }
      });

      if(departures.length > 0) {
        console.log(departures.length + " departures loaded");
        await Departure.createEach(departures);
        await Loaded.create({origin: fromStop.id, destination: toStop.id, date: inputs.date});
        departures = await Departure.find({origin: fromStop.id, destination: toStop.id, date: inputs.date})
                                        .populate('origin').populate('destination')
                                        .populate('terminal').populate('via');
        return exits.success(departures);
      } else {
        console.log("No departures");
        await Loaded.create({origin: fromStop.id, destination: toStop.id, date: inputs.date});
        return exits.success([]);
      }
    }, 1000);
  }
};
