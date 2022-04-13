'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Moderators', [
     {userId: 4,serverId: 1},

     {userId: 5,serverId: 2},

     {userId: 7,serverId: 3},

     {userId: 6,serverId: 4},

     {userId: 10,serverId: 5},

     {userId: 8,serverId: 6},

     {userId: 1,serverId: 7},

     {userId: 3,serverId: 8},

     {userId: 2,serverId: 9},

     {userId: 9,serverId: 10},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Moderators', null, {});
  }
};
