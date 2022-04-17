'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    serverImage: DataTypes.STRING,
    serverName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
    Server.hasOne(models.Admin, {foreignKey:"serverId", onDelete: 'CASCADE',hooks: true,})
    Server.hasMany(models.Member, {foreignKey:"serverId",onDelete: 'CASCADE',hooks: true,})
    Server.hasMany(models.Moderator, {foreignKey:"serverId",onDelete: 'CASCADE',hooks: true,})
    Server.hasMany(models.TextChannel, {foreignKey:"serverId",onDelete: 'CASCADE',hooks: true,})
    Server.hasMany(models.VoiceChannel, {foreignKey:"serverId",onDelete: 'CASCADE',hooks: true,})
  };
  return Server;
};
