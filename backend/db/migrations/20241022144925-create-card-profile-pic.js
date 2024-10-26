'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CardProfilePics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imgId: {
        type: Sequelize.INTEGER,
        references: {
          model:"Images",
          key: 'id'
        },
        onDelete:'CASCADE'
      },
      cardId: {
        type: Sequelize.INTEGER,
        references: {
          model:"Cards",
          key: 'id'
        },
        onDelete:'CASCADE'
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
    options.tableName = 'CardProfilePics';
    await queryInterface.dropTable(options);
  }
};
