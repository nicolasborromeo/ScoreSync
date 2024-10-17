'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CardTracks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cards',
          key:'id'
        },
        onDelete: 'CASCADE'
      },
      trackId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tracks',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      trackOrder: {
        type: Sequelize.INTEGER
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
    options.tableName = 'CardTracks';
    await queryInterface.dropTable(options);
  }
};
