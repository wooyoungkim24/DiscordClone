'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users"
          }
        }
      },
      inviterId:{
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users"
          }
        }
      },
      pending:{
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      serverId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Servers"
          }
        }
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
    return queryInterface.dropTable('Members');
  }
};
