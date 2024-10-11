'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.User, {foreignKey:'userId', onDelete:'CASCADE'})
    }
  }
  Image.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'Users',
        key:'id',
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isUrl: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
