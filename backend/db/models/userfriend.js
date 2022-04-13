'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFriend = sequelize.define('UserFriend', {
    friendSrc: DataTypes.INTEGER,
    friendTarget: DataTypes.INTEGER
  }, {});
  UserFriend.associate = function(models) {
    // associations can be defined here
  };
  return UserFriend;
};