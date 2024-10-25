'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDisplayInfo extends Model {
  
    static associate(models) {
      UserDisplayInfo.belongsTo(models.User, {foreignKey:'userId', onDelete: 'CASCADE'})
    }
  }
  UserDisplayInfo.init({
    name: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    bio: {
      type: DataTypes.TEXT
    },
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    jobTitle: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'UserDisplayInfo',
  });
  return UserDisplayInfo;
};
