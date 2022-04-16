'use strict';
module.exports = (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define('DirectMessage', {
    user1: DataTypes.INTEGER,
    user2: DataTypes.INTEGER,
    messageHistory: DataTypes.JSONB
  }, {});
  DirectMessage.associate = function(models) {
    // associations can be defined here
  };
  return DirectMessage;
};
