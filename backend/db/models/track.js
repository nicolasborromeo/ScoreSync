'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Track extends Model {

    static associate(models) {
      Track.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'})
      Track.belongsToMany(models.Card, {through: models.CardTrack , foreignKey:'trackId', otherKey:'cardId', onDelete:'CASCADE'})
    }
  }
  Track.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
      },
    },
  }, {
    sequelize,
    modelName: 'Track',
  });
  return Track;
};
