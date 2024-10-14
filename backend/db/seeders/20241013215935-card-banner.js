'use strict';

const {CardBanner} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    CardBanner.bulkCreate([
      {
        imgId: 3,
        cardId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgId: 2,
        cardId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'CardBanners'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      cardId: {
        [Op.in]: [1,2]
      }
    }, {});
  }
};
