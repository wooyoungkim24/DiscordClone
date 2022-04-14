'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    serverImage: DataTypes.STRING,
    serverName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
    Server.hasOne(models.Admin, {foreignKey:"serverId"})
    Server.hasMany(models.Member, {foreignKey:"serverId"})
    Server.hasMany(models.Moderator, {foreignKey:"serverId"})
    Server.hasMany(models.TextChannel, {foreignKey:"serverId"})
    Server.hasMany(models.VoiceChannel, {foreignKey:"serverId"})
  };
  return Server;
};
