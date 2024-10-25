'use strict';

const { CardColor } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    CardColor.bulkCreate([
      {
        cardId: 1,
        primaryBackground: '#141418',
        secondaryBackground: '#141418',
        primaryTextColor: '#ececec',
        secondaryTextColor: '#b6b6b6',
        waveformColor: '#b6b6b6'
      },
      {
        cardId: 2,
        primaryBackground: '#2f1815',
        secondaryBackground: '#141418',
        primaryTextColor: '#ececec',
        secondaryTextColor: '#b6b6b6',
        waveformColor: '#a77049'
      },
      {
        cardId: 3
      },
      {
        cardId: 4
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'CardColors'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      cardId:{
        [Op.in]: [1, 2, 3, 4]
      }
    }, {});
  }
};
