'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardFont extends Model {
    
    static associate(models) {
      CardFont.belongsTo(models.Card, {foreignKey:'cardId', onDelete:'CASCADE'})
    }
  }
  CardFont.init({
    cardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cards',
        key: 'id'
      },
      onDelete:'CASCADE'
    },
    fontSize: {
      type: DataTypes.INTEGER,
      defaultValue: 16
    },
    fontFamily: {
      type: DataTypes.STRING,
      defaultValue: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    }
  }, {
    sequelize,
    modelName: 'CardFont',
  });
  return CardFont;
};
