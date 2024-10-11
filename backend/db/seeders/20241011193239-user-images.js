'use strict';

const { Image } = require('../models')

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
        url: 'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+2.jpg',
        key: 'nicoborro/images/Nico 2.jpg'
      },
      {
        userId: 4,
        name: 'Nico Charango.png',
        url: 'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+Charango.png',
        key: 'nicoborro/images/Nico Charango.png'
      },
      {
        userId: 4,
        name: 'Nico Goldtop Studio 2.png',
        url: 'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+Goldtop+Studio+2.png',
        key: 'nicoborro/images/Nico Goldtop Studio 2.png'
      },
      {
        userId: 4,
        name: 'Nico Goldtop Studios.png',
        url: 'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+Goldtop+Studios.png',
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
          'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+2.jpg',
          'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+Charango.png',
          'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+Goldtop+Studio+2.png',
          'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/nicoborro/images/Nico+Goldtop+Studios.png',
        ]
      }
    }, {});

  }
};
