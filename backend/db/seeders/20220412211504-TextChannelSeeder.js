'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('TextChannels', [
     {channelName: 'General',serverId: 1},
     {channelName: 'Text Chat',serverId: 1},
     {channelName: 'Clips',serverId: 1},

     {channelName: 'General',serverId: 2},
     {channelName: 'Text Chat',serverId: 2},
     {channelName: 'Clips',serverId: 2},

     {channelName: 'General',serverId: 3},
     {channelName: 'Text Chat',serverId: 3},
     {channelName: 'Strategy',serverId: 3},

     {channelName: 'General',serverId: 4},
     {channelName: 'Text Chat',serverId: 4},
     {channelName: 'Clips',serverId: 4},

     {channelName: 'General',serverId: 5},
     {channelName: 'Text Chat',serverId: 5},
     {channelName: 'Social',serverId: 5},

     {channelName: 'General',serverId: 6},
     {channelName: 'Text Chat',serverId: 6},
     {channelName: 'Clips',serverId: 6},

     {channelName: 'General',serverId: 7},
     {channelName: 'Text Chat',serverId: 7},
     {channelName: 'Clips',serverId: 7},

     {channelName: 'General',serverId: 8},
     {channelName: 'Text Chat',serverId: 8},
     {channelName: 'Crad Trading',serverId: 8},

     {channelName: 'General',serverId: 9},
     {channelName: 'Text Chat',serverId: 9},
     {channelName: 'My Dress-up Darling',serverId: 9},

     {channelName: 'General',serverId: 10},
     {channelName: 'Text Chat',serverId: 10},
     {channelName: 'Recommendations',serverId: 10},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('TextChannels', null, {});
  }
};
