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

  questions() {
    return this.hasMany("App/Models/Question");
  }

  answers() {
    return this.hasMany("App/Models/Answer");
  }

  likes() {
    return this.hasMany("App/Models/Like");
  }

  comments() {
    return this.hasMany("App/Models/Comment");
  }

  badges() {
    return this.belongsToMany("App/Models/Badge");
  }

  subscriptions() {
    return this.hasMany("App/Models/Subscription");
  }

  questionVotes() {
    return this.hasMany("App/Models/QuestionVote");
  }

  answerVotes() {
    return this.hasMany("App/Models/AnswerVote");
  }

  location() {
    return this.hasOne("App/Models/Location");
  }
}

module.exports = User;
