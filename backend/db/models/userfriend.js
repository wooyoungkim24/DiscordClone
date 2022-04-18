'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFriend = sequelize.define('UserFriend', {
    friend1: DataTypes.INTEGER,
    friend2: DataTypes.INTEGER,
    pending: DataTypes.BOOLEAN
  }, {});
  UserFriend.associate = function(models) {
    // associations can be defined here
    UserFriend.belongsTo(models.User, {as:"added",foreignKey:"friend1"})
    UserFriend.belongsTo(models.User, {as:"addee",foreignKey:"friend2"})
  };
  return UserFriend;
};
