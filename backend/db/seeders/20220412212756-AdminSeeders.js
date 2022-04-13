'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Admins', [
     {userId: 1,serverId: 1},
     {userId: 2,serverId: 2},
     {userId: 3,serverId: 3},
     {userId: 4,serverId: 4},
     {userId: 5,serverId: 5},
     {userId: 6,serverId: 6},
     {userId: 7,serverId: 7},
     {userId: 8,serverId: 8},
     {userId: 9,serverId: 9},
     {userId: 10,serverId: 10},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Admins', null, {});
  }
};
