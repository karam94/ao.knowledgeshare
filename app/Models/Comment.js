"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Comment extends Model {
  author() {
    return this.belongsTo("App/Models/User");
  }

  post() {
    return this.belongsTo("App/Models/Post");
  }

  video() {
    return this.belongsTo("App/Models/Video");
  }
}

module.exports = Comment;
