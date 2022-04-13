'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Members', [
     {userId: 6,serverId: 1},
     {userId: 2,serverId: 1},
     {userId: 3,serverId: 1},


     {userId: 3,serverId: 2},
     {userId: 6,serverId: 2},
     {userId: 7,serverId: 2},

     {userId: 4,serverId: 3},
     {userId: 8,serverId: 3},
     {userId: 10,serverId: 3},

     {userId: 2,serverId: 4},
     {userId: 1,serverId: 4},
     {userId: 3,serverId: 4},

     {userId: 7,serverId: 5},
     {userId: 8,serverId: 5},
     {userId: 9,serverId: 5},

     {userId: 1,serverId: 6},
     {userId: 2,serverId: 6},
     {userId: 3,serverId: 6},

     {userId: 4,serverId: 7},
     {userId: 6,serverId: 7},
     {userId: 5,serverId: 7},

     {userId: 2,serverId: 8},
     {userId: 7,serverId: 8},
     {userId: 10,serverId: 8},

     {userId: 1,serverId: 9},
     {userId: 10,serverId: 9},
     {userId: 5,serverId: 9},

     {userId: 4,serverId: 10},
     {userId: 8,serverId: 10},
     {userId: 3,serverId: 10},

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Members', null, {});
  }
};
