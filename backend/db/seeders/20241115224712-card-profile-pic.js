'use strict';
const { CardProfilePic } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    CardProfilePic.bulkCreate([
      {
        imgId: 1,
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

  async down(queryInterface, Sequelize) {
    options.tableName = 'CardProfilePics'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      cardId: {
        [Op.in]: [1, 2]
      }
    }, {})
  }
};
