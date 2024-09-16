'use strict';
const { Model, DataTypes } = require('sequelize');
const db = require('./index');

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

User.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, {
  sequelize: db.sequelize,
  modelName: 'User',
});

module.exports = User;
