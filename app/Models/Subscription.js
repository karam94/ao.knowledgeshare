"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Subscription extends Model {
  subscriber() {
    return this.belongsTo("App/Models/User");
  }

  category() {
    return this.belongsTo("App/Models/Category");
  }
}

module.exports = Subscription;
