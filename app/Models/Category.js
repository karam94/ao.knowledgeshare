"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Category extends Model {
  posts() {
    return this.hasMany("App/Models/Post");
  }

  subscribers() {
    return this.hasMany("App/Models/Subscription");
  }
}

module.exports = Category;
