module.exports = function(sequelize, DataTypes) {
  var PasswordResetRequest = sequelize.define("PasswordResetRequest", {
    userId: DataTypes.INTEGER,
    uuid: DataTypes.UUID
  }, {
    comment: 'Password Reset Requests',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        PasswordResetRequest.belongsTo(models.User);
      }
    }
  });

  return PasswordResetRequest;
};
