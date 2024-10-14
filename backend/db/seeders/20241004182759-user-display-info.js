'use strict';

const { UserDisplayInfo } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await UserDisplayInfo.bulkCreate([
      {
        name: 'Sophia Turner',
        userId: 1,
        bio: "Sophia Turner is an innovative composer and music producer known for her work in film and television. With a rich background in classical music and a degree in music composition from Juilliard, she has successfully transitioned to producing contemporary scores that resonate with audiences. Her work blends orchestral elements with modern electronic sounds, creating a unique auditory experience.\nSophia has collaborated with several award-winning filmmakers, including her recent partnership with director Jane Doe on the critically acclaimed film 'Whispers of the Heart.'\n Her compositions have been featured in prominent festivals worldwide, such as Sundance and Cannes, earning her accolades and recognition in the industry.",
        jobTitle: 'Music Composer',
        email: 'sophia.turner@music.com',
        phone: '415-555-0199'
      },
      {
        name: 'Ava Johnson',
        userId: 2,
        bio: "Ava Johnson is a versatile music producer and sound engineer with a passion for blending genres. After graduating from Berklee College of Music with a degree in audio engineering, she began her career working with various artists across pop, rock, and electronic music.\nAva has contributed her skills to several top-charting albums and is known for her innovative approach to sound design. Her meticulous attention to detail and her ability to create immersive soundscapes have earned her collaborations with both emerging and established artists. In addition to her production work, Ava is an advocate for women in music, frequently participating in workshops and panels to inspire the next generation of female producers.",
        jobTitle: 'Music Producer',
        email: 'avajohnsonmusic@gmail.com',
        phone: '555-123-4567'
      },
      {
        name: 'Liam Smith',
        userId: 3,
        bio: "Liam Smith is an accomplished film composer and musician with a deep love for storytelling through music. He has composed scores for numerous short films, documentaries, and feature films, blending classical orchestration with contemporary sounds.\nHis unique style combines orchestral elements with modern electronic sounds, captivating audiences worldwide. Liam's recent work includes scoring for the award-winning film 'Echoes' and collaborating with various artists in the indie music scene.\nHe also teaches film scoring at local universities, sharing his expertise and passion with aspiring composers. With a keen sense for narrative, Liam believes that music has the power to enhance storytelling and create emotional connections.",
        jobTitle: 'Film Composer',
        email: 'liamsmithmusic@gmail.com',
        phone: '555-765-4321'
      },
      {
        name: 'Nico Borromeo',
        userId: 4,
        bio: "After a decade of major success in Argentina as a music producer and composer, Nico Borromeo made his journey to the United States, where contributing to the two-time Oscar winner Gustavo Santaolalla, he participated in the acclaimed feature film Finch, the Sundance-awarded documentary The Fight, and the Hulu series Monsterland.\nMost recently, his relationship with Tree Adams (Californication, The 100) led him to co-compose for the two-time Emmy winner, Dan Partland's feature documentary God & Country and to work as his assistant in NCIS: Hawai'i, The Eight, and Unfit.\nHis original work in film has been showcased at Sundance, Tribeca, and Slamdance festivals. His first feature film, Soledad, won best picture at the Barcelona Film Festival.",
        website: 'https://www.nicoborromeo.com',
        jobTitle: 'Composer',
        email: 'borromeocomposer@gmail.com',
        phone: '323-283-7085'
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'UserDisplayInfos';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Sophia Turner','Ava Johnson','Liam Smith','Nico Borromeo'] }
    }, {});
  }
};
