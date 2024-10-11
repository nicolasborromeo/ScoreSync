'use strict';

const { Model } = require('sequelize');
const Validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserDisplayInfo,{ foreignKey: 'userId', onDelete: 'CASCADE'})
      User.hasMany(models.ExternalLink, {foreignKey: 'userId', onDelete:'CASCADE'})
      User.hasMany(models.Track, {foreignKey: 'userId', onDelete:'CASCADE'})
      User.hasMany(models.Image, {foreignKey: 'userId', onDelete:'CASCADE'})
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60],
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
      }
    }
  }
);
return User;
};
