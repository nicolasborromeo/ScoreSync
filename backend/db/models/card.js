'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Card.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'})
    }
  }
  Card.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
          model:'Users',
          key:'id'
        },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT
    },
    isLight: {
      type: DataTypes.BOOLEAN
    },
    customBio: {
      type: DataTypes.TEXT
    },
    customJobTitle: {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN
    },
    privateToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previewUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicUrl: {
      type: DataTypes.STRING
    },
    downloadEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};
