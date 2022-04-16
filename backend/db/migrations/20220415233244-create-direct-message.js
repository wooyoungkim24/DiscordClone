'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DirectMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user1: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users"
          }
        }
      },
      user2: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users"
          }
        }
      },
      messageHistory: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DirectMessages');
  }
};
