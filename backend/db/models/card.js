'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {

    static associate(models) {
      Card.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'})
      Card.belongsToMany(models.Image, {through: models.CardBanner, as: 'Banner', foreignKey: 'cardId',
        otherKey: 'imgId', onDelete:'CASCADE'})
      Card.belongsToMany(models.Image, {through: models.CardHeadshot, as:'Headshot', foreignKey: 'cardId',
        otherKey: 'imgId', onDelete:'CASCADE'})
      Card.belongsToMany(models.Image, {through: models.CardProfilePic, as:'ProfilePic', foreignKey: 'cardId',
        otherKey: 'imgId', onDelete:'CASCADE'})
      Card.belongsToMany(models.Track, {through: models.CardTrack , foreignKey:'cardId', otherKey:'trackId', onDelete:'CASCADE'})
      Card.hasOne(models.CardColor, {foreignKey:'cardId', onDelete:'CASCADE'})
      Card.hasOne(models.CardFont, {foreignKey:'cardId', onDelete:'CASCADE'})
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
