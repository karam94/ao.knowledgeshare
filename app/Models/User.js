"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class User extends Model {
  static boot() {
    super.boot();
  }

  posts() {
    return this.hasMany("App/Models/Post");
  }

  likes() {
    return this.hasMany("App/Models/Like");
  }

  comments() {
    return this.hasMany("App/Models/Comment");
  }

  subscriptions() {
    return this.hasMany("App/Models/Subscription");
  }
}

module.exports = User;
