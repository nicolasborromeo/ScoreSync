'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardHeadshot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CardHeadshot.init({
    imgId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Images',
        key: 'id'
      },
    },
    cardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cards',
        key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'CardHeadshot',
    indexes: [
      {
        unique: true,
        fields: ['cardId', 'imgId']
      }
    ]
  });
  return CardHeadshot;
};
