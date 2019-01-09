"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Answer extends Model {
  author() {
    return this.belongsTo("App/Models/User");
  }

  question() {
    return this.belongsTo("App/Models/Question");
  }

  upvotes() {
    return this.hasMany("App/Models/AnswerVote");
  }

  downvotes() {
    return this.hasMany("App/Models/AnswerVote");
  }

  allanswerupvotes() {
    return this.hasMany("App/Models/AnswerVote");
  }

  allanswerdownvotes() {
    return this.hasMany("App/Models/AnswerVote");
  }
}

module.exports = Answer;
