'use strict';

const { CardFont } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    CardFont.bulkCreate([
      {
        cardId: 1,
      },
      {
        cardId: 2
      },
      {
        cardId: 3
      },
      {
        cardId: 4
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'CardFonts'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      cardId:{
        [Op.in]: [1, 2, 3, 4]
      }
    }, {});
  }
};
