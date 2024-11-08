'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("user", {
      id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      login:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      last_name:{
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }, 
      password_expiration_date:{
        type: Sequelize.DATE,
        allowNull: false,
      }, 
      password_hash:{
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      status:{
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      access_group:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable("user")
  }
};
