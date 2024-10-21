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
    {cardId: 1,
      primaryBackground: '#abbed6',
      secondaryBackground: '#a37ab4',
      primaryTextColor: '#f1b1c1',
      secondaryTextColor: '#9ae5db',
      waveformColor: '#5b828a'
    }
   ], {validate: true})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'CardColors'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      cardId: 1
      // {
      //   [Op.in]: [1]
      // }
    }, {});
  }
};
