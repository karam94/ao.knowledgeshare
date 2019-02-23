"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Video extends Model {
  poster() {
    return this.belongsTo("App/Models/User");
  }

  category() {
    return this.belongsTo("App/Models/Category");
  }

  // likes() {
  //   return this.hasMany("App/Models/Like");
  // }

  comments() {
    return this.hasMany("App/Models/Comment");
  }
}

module.exports = Video;
