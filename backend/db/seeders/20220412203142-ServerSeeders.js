'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Servers', [
     {serverImage: 'https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png',serverName: 'Valorant Accent', userId:1},

     {serverImage: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon4073.jpg?image=q_auto:best&v=1518361200',serverName: 'Jg Diff', userId:2},

     {serverImage: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',serverName: 'Knight to E3', userId:3},

     {serverImage: 'https://pm1.narvii.com/6516/bb6c1401606cec5b8a70f08d39391bcec4498043_hq.jpg',serverName: 'Not A Dead Game', userId:4},

     {serverImage: 'https://i.pinimg.com/originals/44/e2/42/44e2422c7ecf1e9234c7fa4cdf03f060.jpg',serverName: 'Pink Lemon Bars', userId:5},

     {serverImage: 'https://c.tenor.com/bCWhbbjF8dwAAAAC/poggers-pepe.gif',serverName: 'Serious Chat', userId:6},

     {serverImage: 'https://pbs.twimg.com/profile_images/1450901581876973568/0bHBmqXe_400x400.png',serverName: 'Twitch.TV', userId:7},

     {serverImage: 'https://wallpaperaccess.com/full/1429125.jpg',serverName: 'Yu Gi Oh', userId:8},

     {serverImage: 'https://pbs.twimg.com/profile_images/1493147869922177024/9oQNv94k_400x400.jpg',serverName: 'Anime Network', userId:9},

     {serverImage: 'https://static.scientificamerican.com/sciam/cache/file/1DDFE633-2B85-468D-B28D05ADAE7D1AD8_source.jpg?w=590&h=800&D80F3D79-4382-49FA-BE4B4D0C62A5C3ED',serverName: 'The Library', userId:10},

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Servers', null, {});
  }
};
