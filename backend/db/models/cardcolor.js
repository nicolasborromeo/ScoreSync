'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardColor extends Model {

    static associate(models) {
      CardColor.belongsTo(models.Card, {foreignKey:'cardId', onDelete:'CASCADE'})
    }
  }
  CardColor.init({
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model:'Cards',
        key:'id'
      },
      onDelete:'CASCADE'
    },
    primaryBackground: {
      type: DataTypes.STRING,
      defaultValue: '#141418',
    },
    secondaryBackground: {
      type: DataTypes.STRING,
      defaultValue: '#141418',
    },
    primaryTextColor: {
      type: DataTypes.STRING,
      defaultValue: '#ececec'
    },
    secondaryTextColor: {
      type: DataTypes.STRING,
      defaultValue: '#b6b6b6',
    },
    waveformColor: {
      type: DataTypes.STRING,
      defaultValue: '#EB3678'
    }
  }, {
    sequelize,
    modelName: 'CardColor',
  });
  return CardColor;
};
