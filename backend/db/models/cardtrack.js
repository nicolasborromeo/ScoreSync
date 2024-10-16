'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardTrack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CardTrack.init({
    cardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cards',
        key:'id'
      },
      onDelete: 'CASCADE'
    },
    trackId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tracks',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    trackOrder: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'CardTrack',
  });
  return CardTrack;
};
