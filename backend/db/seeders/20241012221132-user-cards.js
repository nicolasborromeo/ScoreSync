'use strict';

const { Card } = require('../models')

let APP_BASE_URL = process.env.APP_BASE_URL

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Card.bulkCreate([
      {
        userId: 4,
        title: "Bleeding Fingers",
        description: "A collection of tracks created for Hans Zimmer's composer agency, the two-time Emmy-winning, ten-time Emmy-nominated, and BAFTA-nominated Bleeding Fingers Music.",
        isLight: true,
        isActive: true,
        customBio: null,
        customJobTitle: "Freelance Composer",
        previewUrl: `${APP_BASE_URL}/cards/preview/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`,
        publicUrl: `${APP_BASE_URL}/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`,
        privateToken: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        title: "Epic Soundtrack",
        description: "An epic collection of soundtracks for your projects.",
        isLight: false,
        isActive: true,
        customBio: null,
        customJobTitle: "Composer",
        previewUrl: `${APP_BASE_URL}/cards/preview/c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r`,
        publicUrl: `${APP_BASE_URL}/c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r`,
        privateToken: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        title: "Retro Classics",
        description: "A nostalgic trip through classic hits.",
        isLight: true,
        isActive: false,
        customBio: "Music Historian",
        customJobTitle: "DJ",
        previewUrl: `${APP_BASE_URL}/cards/preview/d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s`,
        publicUrl: `${APP_BASE_URL}/d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s`,
        privateToken: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        title: "Nature Sounds",
        description: "Calm sounds from nature for relaxation.",
        isLight: true,
        isActive: true,
        customBio: "Nature Lover",
        customJobTitle: "Field Recordist",
        previewUrl: `${APP_BASE_URL}/cards/preview/e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t`,
        publicUrl: `${APP_BASE_URL}/e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t`,
        privateToken: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Cards'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      privateToken: {
        [Op.in]: [
          "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
          "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r",
          "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s",
          "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t"
        ]
      }
    }, {});
  }
};
