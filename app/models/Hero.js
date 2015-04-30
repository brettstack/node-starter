module.exports = function(sequelize, DataTypes) {
  var Hero = sequelize.define('Hero', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [0, 31]
      }
    },
    level: DataTypes.INTEGER,
    class: DataTypes.STRING,
    exp: DataTypes.INTEGER,
    str: DataTypes.INTEGER,
    int: DataTypes.INTEGER,
    dex: DataTypes.INTEGER,
    spd: DataTypes.INTEGER,
    hp: DataTypes.INTEGER,
    mp: DataTypes.INTEGER,
    gold: DataTypes.INTEGER
  }, {
    comment: 'Heroes stored here',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    name: {
      plural: 'heroCollection'
    },
    associate: function(models) {
      Hero.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    },
    defineRoutes: function(models, epilogue) {
      var heroResource = epilogue.resource({
        model: Hero,
        endpoints: ['/hero', '/hero/:id']
      });
      
      heroResource.create.write(function(req, res, context){
        context.instance.dataValues.userId = req.me.id;
          console.log(context.instance.dataValues);
        
        return context.continue;
      });
    },
    instanceMethods: {
      getMaxHp: function() {
        return this.str * 25;
      },
      getMaxMp: function() {
        return this.int * 25;
      },
      getMaxExp: function() {
        return Math.round(this.level * ((this.level + 1) / 2) * 125);
      },
      getExpNeeded: function() {
        return this.getMaxExp() - this.exp;
      }
    }
  });

  return Hero;
};