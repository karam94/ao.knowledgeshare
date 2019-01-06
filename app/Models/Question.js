"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Question extends Model {
  poster() {
    return this.belongsTo("App/Models/User");
  }

  category() {
    return this.belongsTo("App/Models/Category");
  }

  answers() {
    return this.hasMany("App/Models/Answer");
  }

  upvotes() {
    return this.hasMany("App/Models/QuestionVote");
  }

  downvotes() {
    return this.hasMany("App/Models/QuestionVote");
  }
}

module.exports = Question;
