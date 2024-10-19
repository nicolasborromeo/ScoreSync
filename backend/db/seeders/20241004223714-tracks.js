'use strict';


const { Track } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
const AWS_BUCKET_URL = process.env.AWS_BUCKET_URL


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    Track.bulkCreate([
      {
        userId: 4,
        title: 'Nico Borromeo - On The Up (seed)',
        duration: 140,
        filePath: `${AWS_BUCKET_URL}/nicoborro/1729288523011Nico+Borromeo_On+The+Up.wav`,
      },
      {
        userId: 4,
        title: 'Nico Borromeo - Ayrad Kingdom (seed)',
        duration: 174,
        filePath: `${AWS_BUCKET_URL}/nicoborro/1729288367626Nic+Borromeo_Ayrad+Kingdom.wav`,
      },
      {
        userId: 4,
        title: 'Nico Borromeo - Kisaeng Elegy (seed)',
        filePath: `${AWS_BUCKET_URL}/nicoborro/1729288522918Nico+Borromeo_Kisaeng+Elegy.wav`,
      },
      {
        userId: 4,
        title: 'Nico Borromeo - Cyrillic Magic (seed)',
        filePath: `${AWS_BUCKET_URL}/nicoborro/1729288523005Nico+Borromeo_Cyrillic+Magic.wav`,
      },
      {
        userId: 4,
        title: 'Nico Borromeo - Power of Life (seed)',
        filePath: `${AWS_BUCKET_URL}/nicoborro/1729288523008Nico+Borromeo_Power+of+Life.wav`,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Tracks';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      filePath: {
        [Op.in]: [
          `${AWS_BUCKET_URL}/nicoborro/1729288523011Nico+Borromeo_On+The+Up.wav`,
          `${AWS_BUCKET_URL}/nicoborro/1729288367626Nic+Borromeo_Ayrad+Kingdom.wav`,
          `${AWS_BUCKET_URL}/nicoborro/1729288522918Nico+Borromeo_Kisaeng+Elegy.wav`,
          `${AWS_BUCKET_URL}/nicoborro/1729288523005Nico+Borromeo_Cyrillic+Magic.wav`,
          `${AWS_BUCKET_URL}/nicoborro/1729288523008Nico+Borromeo_Power+of+Life.wav`,
        ]
      }
    }, {});
  }
};
