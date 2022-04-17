'use strict';
module.exports = (sequelize, DataTypes) => {
  const TextChannel = sequelize.define('TextChannel', {
    serverId: DataTypes.INTEGER,
    channelName: DataTypes.STRING,
    messageHistory: DataTypes.JSONB
  }, {});
  TextChannel.associate = function(models) {
    // associations can be defined here
    TextChannel.belongsTo(models.Server, {foreignKey:"serverId",onDelete: 'CASCADE',hooks: true,})
  };
  return TextChannel;
};
