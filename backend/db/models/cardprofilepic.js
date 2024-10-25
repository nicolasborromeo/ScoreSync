'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardProfilePic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CardProfilePic.init({
    imgId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Images',
        key: 'id'
      },
      onDelete:'CASCADE'
    },
    cardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cards',
        key: 'id'
      },
      onDelete:'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'CardProfilePic',
  });
  return CardProfilePic;
};
