'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardColor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
      }
    },
    primaryBackground: {
      type: DataTypes.STRING
    },
    secondaryBackground: {
      type: DataTypes.STRING
    },
    primaryTextColor: {
      type: DataTypes.STRING
    },
    secondaryTextColor: {
      type: DataTypes.STRING
    },
    waveformColor: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'CardColor',
  });
  return CardColor;
};
