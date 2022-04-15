'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        profilePicture: "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        profilePicture: "https://image.shutterstock.com/image-photo/profile-picture-smiling-millennial-asian-260nw-1836020740.jpg"
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        profilePicture:"https://media.istockphoto.com/photos/portrait-of-successful-black-male-modern-day-student-holding-picture-id1311634222?k=20&m=1311634222&s=612x612&w=0&h=1a0XDWnZNPjk_5n7maZdzowaDfBcBohwoiZZF69qS9A="
      },
      {
        email: 'user3@user.io',
        username: 'Chewy',
        hashedPassword: bcrypt.hashSync('password4'),
        profilePicture: "https://pbs.twimg.com/media/FP7CqOnXIAQuTz3?format=png&name=small"

      },
      {
        email: 'user4@user.io',
        username: 'Matt',
        hashedPassword: bcrypt.hashSync('password5'),
        profilePicture:"https://pbs.twimg.com/media/FQGOdlkakAMZtIj?format=png&name=small"
      },
      {
        email: 'user5@user.io',
        username: 'Draggling',
        hashedPassword: bcrypt.hashSync('password6'),
        profilePicture:"https://external-preview.redd.it/OSOFY5XCsfKw-mO0vHEUy7WgCA18b_QCpEPBrtjH5Xs.jpg?auto=webp&s=3bf7c7b9ac81afd1287a1dbad753115908739fe6"
      },
      {
        email: 'user6@user.io',
        username: 'Pyooni',
        hashedPassword: bcrypt.hashSync('password7'),
        profilePicture:"https://e7.pngegg.com/pngimages/899/165/png-clipart-league-of-legends-oceanic-pro-league-emote-riot-games-electronic-sports-league-of-legends-game-cartoon.png"
      },
      {
        email: 'user7@user.io',
        username: 'Cactus',
        hashedPassword: bcrypt.hashSync('password8'),
        profilePicture:"https://pbs.twimg.com/media/FQBBLxYX0AI_DRI?format=png&name=small"
      },
      {
        email: 'user8@user.io',
        username: 'Beep',
        hashedPassword: bcrypt.hashSync('password9'),
        profilePicture:"https://pbs.twimg.com/media/FP7CaKdaAAAOVyY?format=png&name=small"
      },
      {
        email: 'user9@user.io',
        username: 'Kiki',
        hashedPassword: bcrypt.hashSync('password10'),
        profilePicture:"https://pbs.twimg.com/media/FPz5KMFUcAETGmF?format=png&name=small"
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
