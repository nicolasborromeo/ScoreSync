'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model:'Users',
          key:'id'
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT
      },
      isLight: {
        type: Sequelize.BOOLEAN
      },
      customBio: {
        type: Sequelize.TEXT
      },
      customJobTitle: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      privateToken: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      previewUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publicUrl: {
        type: Sequelize.STRING,
      },
      downloadEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Cards'
    await queryInterface.dropTable(options);
  }
};
