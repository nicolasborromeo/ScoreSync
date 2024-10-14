'use strict';


const { Track } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
const AWS_BUCKET_URL = process.env.AWS_BUCKET_URL


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Track.bulkCreate([
      {
        userId: 4,
        title: 'Nico Borromeo - On The Up',
        filePath: `${AWS_BUCKET_URL}/nicoborro/1728504844517Nico+Borromeo_On+The+Up.wav`,
      },
      {
        userId: 4,
        title: 'Nico Borromeo - Ayrad Kingdom',
        filePath: `${AWS_BUCKET_URL}/nicoborro/1728504920063Nic+Borromeo_Ayrad+Kingdom.wav`,
      },
      {
        userId: 4,
        title: 'Nico Borromeo - Kisaeng Elegy',
        filePath: `${AWS_BUCKET_URL}/nicoborro/1728504890636Nico+Borromeo_Kisaeng+Elegy.wav`,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Tracks';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      filePath: {
        [Op.in]: [`${AWS_BUCKET_URL}/Nic+Borromeo_Ayrad+Kingdom.wav`,
                   `${AWS_BUCKET_URL}/Nico+Borromeo_Cyrillic+Magic.wav`,
                ]
      }
    }, {});
  }
};
