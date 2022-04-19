'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    userId: DataTypes.INTEGER,
    serverId: DataTypes.INTEGER,
    inviterId: DataTypes.INTEGER,
    pending: DataTypes.BOOLEAN
  }, {});
  Member.associate = function(models) {
    // associations can be defined here
    Member.belongsTo(models.User, {as:"receivor",foreignKey:"userId"})
    Member.belongsTo(models.User, {as:"sender", foreignKey:"inviterId"})
    Member.belongsTo(models.Server, {foreignKey:"serverId",onDelete: 'CASCADE',hooks: true,})
  };
  return Member;
};
