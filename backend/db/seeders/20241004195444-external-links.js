'use strict';

const { ExternalLink } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    ExternalLink.bulkCreate([
      {
        userId: 4,
        company: 'Instagram',
        url: 'https://www.instagram.com/nico_borromeo/'
      },
      {
        userId: 4,
        company: 'Website',
        url: 'https://www.nicoborromeo.com'
      },
      {
        userId: 4,
        company: 'Linkedin',
        url: 'https://www.linkedin.com/in/nicoborromeo/'
      },
    ], {validate: true})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ExternalLinks';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ['https://www.instagram.com/nico_borromeo/',
                   'https://www.nicoborromeo.com',
                 'https://www.linkedin.com/in/nicoborromeo/']
      }
    }, {});
  }
};
