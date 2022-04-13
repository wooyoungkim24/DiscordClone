'use strict';
module.exports = (sequelize, DataTypes) => {
  const Moderator = sequelize.define('Moderator', {
    userId: DataTypes.INTEGER,
    serverId: DataTypes.INTEGER
  }, {});
  Moderator.associate = function(models) {
    // associations can be defined here
  };
  return Moderator;
};