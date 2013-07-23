module.exports = {
  initialise: function(app, mongoose, connection, userAdditions) {
    require('./lib/models/Token').initialise(mongoose, connection);
  },
  Token: function() {
    return require('./lib/models/Token').model()
  }
}
