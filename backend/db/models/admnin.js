'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admnin = sequelize.define('Admnin', {
    userId: DataTypes.INTEGER,
    serverId: DataTypes.INTEGER
  }, {});
  Admnin.associate = function(models) {
    // associations can be defined here
  };
  return Admnin;
};