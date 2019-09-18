import { Model } from 'sequelize';

class Meetups extends Model {
  static init(sequelize) {
    super.init({
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'meetup_id', as: 'meetup',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id', as: 'user',
    });
  }
}

export default Meetups;
