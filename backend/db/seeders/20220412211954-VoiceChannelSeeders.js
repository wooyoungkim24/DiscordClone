'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('VoiceChannels', [
     {channelName: 'VoiceChat1',serverId:1},
     {channelName: 'VoiceChat1',serverId:2},
     {channelName: 'VoiceChat1',serverId:3},
     {channelName: 'VoiceChat1',serverId:4},
     {channelName: 'VoiceChat1',serverId:5},
     {channelName: 'VoiceChat1',serverId:6},
     {channelName: 'VoiceChat1',serverId:7},
     {channelName: 'VoiceChat1',serverId:8},
     {channelName: 'VoiceChat1',serverId:9},
     {channelName: 'VoiceChat1',serverId:10},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('VoiceChannels', null, {});
  }
};
