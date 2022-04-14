'use strict';
module.exports = (sequelize, DataTypes) => {
  const VoiceChannel = sequelize.define('VoiceChannel', {
    serverId: DataTypes.INTEGER
  }, {});
  VoiceChannel.associate = function(models) {
    // associations can be defined here
    VoiceChannel.belongsTo(models.Server, {foreignKey:"serverId"})
  };
  return VoiceChannel;
};
