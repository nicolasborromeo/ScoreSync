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
        },
        onDelete: 'CASCADE'
      },
      primaryBackground: {
        type: Sequelize.STRING,
        defaultValue: '#141418',
      },
      secondaryBackground: {
        type: Sequelize.STRING,
        defaultValue: '#141418',
      },
      primaryTextColor: {
        type: Sequelize.STRING,
        defaultValue: '#ececec'
      },
      secondaryTextColor: {
        type: Sequelize.STRING,
        defaultValue: '#b6b6b6'
      },
      waveformColor: {
        type: Sequelize.STRING,
        defaultValue: '#EB3678'
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
    options.tableName = 'CardColors'
    await queryInterface.dropTable(options);
  }
};
