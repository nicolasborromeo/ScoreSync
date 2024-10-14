'use strict';

const { Image } = require('../models')

const AWS_BUCKET_URL = process.env.AWS_BUCKET_URL

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    Image.bulkCreate([
      {
        userId: 4,
        name: 'Nico 2.jpg',
        url: `${AWS_BUCKET_URL}/nicoborro/images/Nico+2.jpg`,
        key: 'nicoborro/images/Nico 2.jpg'
      },
      {
        userId: 4,
        name: 'Nico Charango.png',
        url: `${AWS_BUCKET_URL}/nicoborro/images/Nico+Charango.png`,
        key: 'nicoborro/images/Nico Charango.png'
      },
      {
        userId: 4,
        name: 'Nico Goldtop Studio 2.png',
        url: `${AWS_BUCKET_URL}/nicoborro/images/Nico+Goldtop+Studio+2.png`,
        key: 'nicoborro/images/Nico Goldtop Studio 2.png'
      },
      {
        userId: 4,
        name: 'Nico Goldtop Studios.png',
        url: `${AWS_BUCKET_URL}/nicoborro/images/Nico+Goldtop+Studios.png`,
        key: 'nicoborro/images/Nico Goldtop Studios.png'
      },

    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: [
          `${AWS_BUCKET_URL}/nicoborro/images/Nico+2.jpg`,
          `${AWS_BUCKET_URL}/nicoborro/images/Nico+Charango.png`,
          `${AWS_BUCKET_URL}/nicoborro/images/Nico+Goldtop+Studio+2.png`,
          `${AWS_BUCKET_URL}/nicoborro/images/Nico+Goldtop+Studios.png`,
        ]
      }
    }, {});

  }
};
