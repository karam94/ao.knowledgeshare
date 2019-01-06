"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class QuestionVote extends Model {
  voter() {
    return this.belongsTo("App/Models/User");
  }

  question() {
    return this.belongsTo("App/Models/Question");
  }
}

module.exports = QuestionVote;
