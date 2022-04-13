'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    serverImage: DataTypes.STRING,
    serverName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};