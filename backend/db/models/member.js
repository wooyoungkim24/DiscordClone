'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    userId: DataTypes.INTEGER,
    serverId: DataTypes.INTEGER
  }, {});
  Member.associate = function(models) {
    // associations can be defined here
    Member.belongsTo(models.User, {foreignKey:"userId"})
    Member.belongsTo(models.Server, {foreignKey:"serverId"})
  };
  return Member;
};
