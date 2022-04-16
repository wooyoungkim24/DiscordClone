'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFriend = sequelize.define('UserFriend', {
    friend1: DataTypes.INTEGER,
    friend2: DataTypes.INTEGER
  }, {});
  UserFriend.associate = function(models) {
    // associations can be defined here
  };
  return UserFriend;
};
