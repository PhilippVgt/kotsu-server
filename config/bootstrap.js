/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

var scheduler = require('node-schedule');

module.exports.bootstrap = async function(done) {

  await sails.helpers.init.with({});

  var updateJob  = scheduler.scheduleJob('0 0 * * *', async function() {
    await sails.helpers.clean.with({});
    await sails.helpers.update.with({});
  });

  setTimeout(async function() {
    await sails.helpers.clean.with({});
    await sails.helpers.update.with({});
  }, 5000);

  return done();

};
