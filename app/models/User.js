var bcrypt = require('bcryptjs');
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      valideate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 255]
      }
    },
    displayName: DataTypes.STRING,
    facebook: DataTypes.STRING,
    google: DataTypes.STRING
  }, {
    comment: 'Users stored here',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        User.hasMany(models.PasswordResetRequest)
      }
    },
    instanceMethods: {
      getGravatar: function(size) {
        if (!size) size = 200;
        if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
        var md5 = crypto.createHash('md5').update(this.email).digest('hex');
        return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
      },
      comparePassword : function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
          if (err) return cb(err);
          cb(null, isMatch);
        });
      },
      getFullname: function() {
        return [this.givenNames, this.familyName].join(' ')
      }
    }
  });

  return User;
};
