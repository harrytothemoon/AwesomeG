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
          introduction: faker.lorem.text(),
          gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
          avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
          bankaccount: faker.finance.account(12),
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
          gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
          quantity: 0,
          avatar: `https://loremflickr.com/320/240/people/?lock=${Math.random() * 100}`,
        })
      ), {})

    await queryInterface.bulkInsert('Subjects',
      ['Math', 'Physical', 'Chemical']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    await queryInterface.bulkInsert('Scopes',
      ['primary school 1st', 'primary school 2nd', 'primary school 3rd', 'primary school 4th', 'primary school 5th', 'primary school 6th', 'middle school 1st', 'middle school 2nd', 'middle school 3rd', 'high school 1st', 'high school 2nd', 'high school 3rd', 'university or others']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Statuses',
      ['wait for a teacher ...', 'working on it !', 'done', 'complete']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Products',
      [['Easy Learning', 20, 990], ['Become a master', 66, 2990]]
        .map((item, index) =>
          ({
            id: index + 1,
            name: item[0],
            description: item[1],
            price: item[2],
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
          SubjectId: 1 + Math.floor(Math.random() * 3),
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
