'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserFriends', {
      friend1: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users"
          }
        }
      },
      friend2: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users"
          }
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserFriends');
  }
};
