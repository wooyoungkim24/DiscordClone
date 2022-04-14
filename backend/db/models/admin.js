'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    userId: DataTypes.INTEGER,
    serverId: DataTypes.INTEGER
  }, {});
  Admin.associate = function(models) {
    // associations can be defined here
    Admin.belongsTo(models.User, {foreignKey:"userId"})
    Admin.belongsTo(models.Server, {foreignKey:"serverId"})
  };
  return Admin;
};
