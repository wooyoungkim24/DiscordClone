'use strict';
module.exports = (sequelize, DataTypes) => {
  const VoiceChannel = sequelize.define('VoiceChannel', {
    serverId: DataTypes.INTEGER
  }, {});
  VoiceChannel.associate = function(models) {
    // associations can be defined here
  };
  return VoiceChannel;
};