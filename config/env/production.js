module.exports = {

  datastores: {
    default: {
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017,
      user: 'kotsu_backend',
      password: '',
      database: 'kotsu'
    },

  },

  models: {
    migrate: 'safe'
  },

  blueprints: {
    shortcuts: false
  },

  session: {
  cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
  },

  sockets: {
    onlyAllowOrigins: [],
  },

  log: {
    level: 'debug'
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year
  },

  explicitHost: "0.0.0.0",
  port: 61472

};
