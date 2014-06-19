var Token = null;

var initialiseSchema = function(database) {

  Token = database.connections.main.define('tokens', {
    payload: {
      type: String,
      length: 355,
      required: true
    },
    type: {
      type: String,
      length: 355,
      required: true
    },
    token: {
      type: String,
      length: 355,
      unique: true
    },
    expiryTime: {
      type: Number,
      default: 1 * 60 * 60 // One day
    },
    used: {
      type: Boolean,
      default: false
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: Date
  });

  Token.prototype.isExpired = function() {
    return this.created + this.expiryTime > Date.now;
  };

  Token.prototype.incrementUses = function(callback) {
    var updates = { $inc: { uses: 1 } };
    return this.update(updates, callback);
  };

  Token.getValid = function(token, type, callback) {
    this.findOne({ token: token, type: type, used: false }, function(error, instance) {
      if (error) return callback(error);

      if (!instance) {
        return callback(new Error('Token not found'), null, TokenSchema.statics.failedRetrieval.NOT_FOUND);
      }

      instance.incrementUses(function(error) {
        if (error) callback(error);
        if (instance.isExpired) {
          return callback(new Error('Token expired'), null, TokenSchema.statics.failedRetrieval.EXPIRED);
        }
        callback(null, instance);
      });
    });
  };

  /**
  * Enum representing failed retrieval reasons
  */
  Token.failedRetrieval = {
    NOT_FOUND: 0,
    EXPIRED: 1
  };

  Token.beforeSave = function(next, data) {
    if (!this.isNew) {
      next();
    }
    var self = this;
    require('crypto').randomBytes(48, function(ex, buf) {
      self.token = buf.toString('hex');
      next();
    });
  };
};

module.exports = {

  /**
   * Initialse the Token model
   */
  initialise: function(database) {
    initialiseSchema(database);
  },
  model: function() {
    return Token;
  }
};
