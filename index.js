module.exports = {
  initialise: function(app) {
    require('./lib/models/Token').initialise(app.get('database'));
  },
  Token: function() {
    return require('./lib/models/Token').model();
  }
};
