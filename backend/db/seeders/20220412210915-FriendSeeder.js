'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('UserFriends', [



      { friend1: 1, friend2: 2 , pending:false},
      { friend1: 1, friend2: 3 , pending:false},
      { friend1: 1, friend2: 4 , pending:false},
      { friend1: 1, friend2: 5 , pending:false},
      { friend1: 1, friend2: 6 , pending:false},

      { friend1: 2, friend2: 3 , pending:false},
      { friend1: 2, friend2: 4 , pending:false},
      { friend1: 2, friend2: 5 , pending:false},
      { friend1: 2, friend2: 6 , pending:false},


      { friend1: 3, friend2: 4 , pending:false},
      { friend1: 3, friend2: 5 , pending:false},
      { friend1: 3, friend2: 6 , pending:false},


      { friend1: 4, friend2: 5 , pending:false},
      { friend1: 4, friend2: 6 , pending:false},


      { friend1: 5, friend2: 6 , pending:false},



      { friend1: 7, friend2: 8 , pending:false},
      { friend1: 7, friend2: 9 , pending:false},
      { friend1: 7, friend2: 10 , pending:false},




      { friend1: 8, friend2: 9 , pending:false},
      { friend1: 8, friend2: 10 , pending:false},




      { friend1: 9, friend2: 10 , pending:false},










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
