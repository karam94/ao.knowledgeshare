"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Badge extends Model {
  users() {
    return this.belongsToMany("App/Models/User");
  }

  category() {
    return this.belongsTo("App/Models/Category");
  }
}

module.exports = Badge;
