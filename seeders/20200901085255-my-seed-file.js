'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
const question = ['https://i.pinimg.com/564x/ef/d2/cb/efd2cb7a8ded0c0d0c9e402bd29dac34.jpg', 'https://i.pinimg.com/originals/7b/25/b0/7b25b099ffe7e2804d13cb87821c7788.gif', 'https://i.pinimg.com/564x/a7/c2/94/a7c2942dbcf9fa79e5fa52e83798ec0d.jpg', 'https://i.pinimg.com/564x/84/7c/c6/847cc61684dbd837ff00d45a4c233128.jpg', 'https://i.pinimg.com/564x/63/08/2b/63082bd6e2a862bca8ed72835022bc7e.jpg']
faker.locale = "en";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10), null),
      role: "admin",
      name: "root",
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: faker.image.avatar()
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
          introduction: faker.hacker.phrase(),
          gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
          avatar: faker.image.avatar(),
          bankaccount: faker.finance.account(12),
          expertise: ['Math', 'Chemical', 'Physical'][Math.floor(Math.random() * 3)],
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
          avatar: faker.image.avatar(),
          grade: ['primary school 1st', 'primary school 2nd', 'primary school 3rd', 'primary school 4th', 'primary school 5th', 'primary school 6th', 'middle school 1st', 'middle school 2nd', 'middle school 3rd', 'high school 1st', 'high school 2nd', 'high school 3rd', 'university or others'][Math.floor(Math.random() * 13)]
        })
      ), {})

    await queryInterface.bulkInsert('Subjects',
      ['Math', 'Physical', 'Chemical']
        .map((item, index) =>
          ({
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    await queryInterface.bulkInsert('Scopes',
      ['primary school 1st', 'primary school 2nd', 'primary school 3rd', 'primary school 4th', 'primary school 5th', 'primary school 6th', 'middle school 1st', 'middle school 2nd', 'middle school 3rd', 'high school 1st', 'high school 2nd', 'high school 3rd', 'university or others']
        .map((item, index) =>
          ({
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Statuses',
      ['wait for a teacher ...', 'working on it !', 'done', 'complete']
        .map((item, index) =>
          ({
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Products',
      [['Easy Learning', 20, 990], ['Become a master', 66, 2990]]
        .map((item, index) =>
          ({
            name: item[0],
            description: item[1],
            price: item[2],
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Questions',
      Array.from({ length: 5 }).map((d, i) =>
        ({
          description: faker.hacker.phrase(),
          image: question[i],
          StatusId: 1,
          UserId: 8 + Math.floor(Math.random() * 6),
          SubjectId: 1 + Math.floor(Math.random() * 3),
          ScopeId: 1 + Math.floor(Math.random() * 13),
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
