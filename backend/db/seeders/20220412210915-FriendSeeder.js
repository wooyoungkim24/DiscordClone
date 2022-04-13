'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('UserFriends', [



      { friend1: 1, friend2: 2 },
      { friend1: 1, friend2: 3 },
      { friend1: 1, friend2: 4 },
      { friend1: 1, friend2: 5 },
      { friend1: 1, friend2: 6 },

      { friend1: 2, friend2: 3 },
      { friend1: 2, friend2: 4 },
      { friend1: 2, friend2: 5 },
      { friend1: 2, friend2: 6 },


      { friend1: 3, friend2: 4 },
      { friend1: 3, friend2: 5 },
      { friend1: 3, friend2: 6 },


      { friend1: 4, friend2: 5 },
      { friend1: 4, friend2: 6 },


      { friend1: 5, friend2: 6 },



      { friend1: 7, friend2: 8 },
      { friend1: 7, friend2: 9 },
      { friend1: 7, friend2: 10 },
      



      { friend1: 8, friend2: 9 },
      { friend1: 8, friend2: 10 },




      { friend1: 9, friend2: 10 },










    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('UserFriends', null, {});
  }
};
