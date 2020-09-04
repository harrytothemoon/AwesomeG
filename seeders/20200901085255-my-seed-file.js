'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10), null),
      role: "admin",
      name: "root",
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://loremflickr.com/320/240/girl/?lock=${Math.random() * 100}`
    }], {})

    await queryInterface.bulkInsert('Users',
      Array.from({ length: 6 }, (_, i) =>
        ({
          email: `user${i}@example.com`,
          password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10), null),
          role: 'teacher',
          name: faker.name.findName(),
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
        })
      ), {})
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 6 }, (_, i) =>
        ({
          email: `user${6 + i}@example.com`,
          password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10), null),
          role: 'student',
          name: faker.name.findName(),
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
        })
      ), {})

    await queryInterface.bulkInsert('Subjects',
      ['數學', '物理', '化學']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    await queryInterface.bulkInsert('Scopes',
      ['小一', '小二', '小三', '小四', '小五', '小六', '國一', '國二', '國三', '高一', '高二', '高三', '大學以上']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Statuses',
      ['wait', 'work', 'done', 'complete']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Questions',
      Array.from({ length: 5 }).map(d =>
        ({
          description: faker.lorem.text(),
          image: `https://loremflickr.com/320/240/question/?lock=${Math.random() * 100}`,
          StatusId: 1,
          UserId: 8 + Math.floor(Math.random() * 7),
          SubjectId: 1 + Math.floor(Math.random() * 13),
          ScopeId: 1 + Math.floor(Math.random() * 4),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Subjects', null, {});
    await queryInterface.bulkDelete('Scopes', null, {});
    await queryInterface.bulkDelete('Questions', null, {});
  }
};
