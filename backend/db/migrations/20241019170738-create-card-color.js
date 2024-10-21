'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CardColors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cardId: {
        type: Sequelize.INTEGER,
        references: {
          model:'Cards',
          key:'id'
        }
      },
      primaryBackground: {
        type: Sequelize.STRING
      },
      secondaryBackground: {
        type: Sequelize.STRING
      },
      primaryTextColor: {
        type: Sequelize.STRING
      },
      secondaryTextColor: {
        type: Sequelize.STRING
      },
      waveformColor: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'CardColors'
    await queryInterface.dropTable(options);
  }
};
