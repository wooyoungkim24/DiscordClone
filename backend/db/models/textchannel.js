'use strict';
module.exports = (sequelize, DataTypes) => {
  const TextChannel = sequelize.define('TextChannel', {
    serverId: DataTypes.INTEGER
  }, {});
  TextChannel.associate = function(models) {
    // associations can be defined here
  };
  return TextChannel;
};