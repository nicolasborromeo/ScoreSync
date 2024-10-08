'use strict';


const { Track } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Track.bulkCreate([
      {
        userId: 2,
        title: 'Nico Borromeo - Cyrillic Magic',
        filePath: 'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/Nico+Borromeo_Cyrillic+Magic.wav',
      },
      {
        userId: 2,
        title: 'Nico Borromeo - Ayrad Kingdom',
        filePath: 'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/Nic+Borromeo_Ayrad+Kingdom.wav',
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Tracks';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      filePath: {
        [Op.in]: ['https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/Nic+Borromeo_Ayrad+Kingdom.wav',
                   'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/Nico+Borromeo_Cyrillic+Magic.wav',
                ]
      }
    }, {});
  }
};
