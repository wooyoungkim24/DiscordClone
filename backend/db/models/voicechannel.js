'use strict';
module.exports = (sequelize, DataTypes) => {
  const VoiceChannel = sequelize.define('VoiceChannel', {
    serverId: DataTypes.INTEGER,
    channelName: DataTypes.STRING,
    voiceMembers:DataTypes.JSONB
  }, {});
  VoiceChannel.associate = function(models) {
    // associations can be defined here
    VoiceChannel.belongsTo(models.Server, {foreignKey:"serverId",onDelete: 'CASCADE',hooks: true,})
  };
  return VoiceChannel;
};
