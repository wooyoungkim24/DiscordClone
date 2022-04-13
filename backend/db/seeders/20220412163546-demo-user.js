'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user3@user.io',
        username: 'Chewy',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user4@user.io',
        username: 'Matt',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        email: 'user5@user.io',
        username: 'Draggling',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        email: 'user6@user.io',
        username: 'Pyooni',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        email: 'user7@user.io',
        username: 'Cactus',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        email: 'user8@user.io',
        username: 'Beep',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        email: 'user9@user.io',
        username: 'Kiki',
        hashedPassword: bcrypt.hashSync('password10')
      }

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2','Chewy','Matt','Draggling', 'Pyooni','Cactus','Beep','Kiki'] }
    }, {});
  }
};
