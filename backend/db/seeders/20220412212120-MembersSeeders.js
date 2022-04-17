'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Members', [
     {userId: 6,serverId: 1, inviterId: 2, pending:false},
     {userId: 2,serverId: 1, inviterId: 3, pending:false},
     {userId: 3,serverId: 1, inviterId: 6, pending:false},


     {userId: 3,serverId: 2, inviterId: 6, pending:false},
     {userId: 6,serverId: 2, inviterId: 7, pending: false},
     {userId: 7,serverId: 2, inviterId: 3, pending:false},

     {userId: 4,serverId: 3, inviterId: 8, pending:false},
     {userId: 8,serverId: 3, inviterId: 10, pending:false},
     {userId: 10,serverId: 3, inviterId: 4, pending:false},

     {userId: 2,serverId: 4, inviterId: 3, pending:false},
     {userId: 1,serverId: 4, inviterId: 2, pending:false},
     {userId: 3,serverId: 4, inviterId: 1, pending:false},

     {userId: 7,serverId: 5, inviterId: 8, pending:false},
     {userId: 8,serverId: 5,inviterId: 9, pending:false},
     {userId: 9,serverId: 5,inviterId: 7, pending:false},

     {userId: 1,serverId: 6, inviterId: 2, pending:false},
     {userId: 2,serverId: 6,inviterId: 3, pending:false},
     {userId: 3,serverId: 6, inviterId: 1, pending:false},

     {userId: 4,serverId: 7,inviterId: 6, pending:false},
     {userId: 6,serverId: 7, inviterId: 5, pending:false},
     {userId: 5,serverId: 7, inviterId: 4, pending:false},

     {userId: 2,serverId: 8, inviterId: 7, pending:false},
     {userId: 7,serverId: 8, inviterId: 10, pending:false},
     {userId: 10,serverId: 8, inviterId: 2, pending:false},

     {userId: 1,serverId: 9, inviterId: 10, pending:false},
     {userId: 10,serverId: 9,  inviterId: 5, pending:false},
     {userId: 5,serverId: 9, inviterId: 1, pending:false},

     {userId: 4,serverId: 10,  inviterId: 8, pending:false},
     {userId: 8,serverId: 10,  inviterId: 3, pending:false},
     {userId: 3,serverId: 10,  inviterId: 4, pending:false},

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
