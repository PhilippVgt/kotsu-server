module.exports = {

  friendlyName: 'Email',
  description: 'Send update emails.',

  inputs: {
    kotsu: {
      type: 'number',
      example: 3164,
      description: 'The number of departures loaded from Nara Kotsu.',
      required: true
    },
    kate: {
      type: 'number',
      example: 1235,
      description: 'The number of departures loaded from KATE.',
      required: true
    },
    date: {
      type: 'string',
      example: '2018-08-27',
      description: 'The date departures were loaded for.',
      required: true
    }
  },

  fn: async function (inputs, exits) {

    sails.hooks.email.send(
      "status",
      {
        Kotsu: inputs.kotsu,
        Kate: inputs.kate,
        Date: inputs.date
      },
      {
        to: "philipp@mphsoftware.de",
      },
      function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("Sent!");
        }
      }
    )

    return exits.success();
  }

};
