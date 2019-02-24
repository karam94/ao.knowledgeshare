"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Like extends Model {
  liker() {
    return this.belongsTo("App/Models/User");
  }

  post() {
    return this.belongsTo("App/Models/Post");
  }

  video() {
    return this.belongsTo("App/Models/Video");
  }
}

module.exports = Like;
