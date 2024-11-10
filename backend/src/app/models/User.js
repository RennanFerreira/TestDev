import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      login: Sequelize.STRING,
      name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      email: Sequelize.STRING,
      password_expiration_date: Sequelize.DATE,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      status: Sequelize.STRING,
      access_group: Sequelize.STRING,
    },{
      sequelize,
      tableName: 'user'
    });
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    this.addHook('beforeUpdate', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;