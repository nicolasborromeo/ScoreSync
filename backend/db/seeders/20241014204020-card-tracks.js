'use strict';


const { CardTrack } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    CardTrack.bulkCreate([
      {
        cardId: 1,
        trackId: 1,
        trackOrder:1
      },
      {
        cardId: 1,
        trackId: 2,
        trackOrder:2
      },
      {
        cardId: 1,
        trackId: 3,
        trackOrder:3
      }

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'CardTracks'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      cardId: 1
      // {
      //   [Op.in]: [1]
      // }
    }, {});
  }
};
