"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class QuestionVoteSchema extends Schema {
  up () {
    this.create("question_votes", (table) => {
      table.increments();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("cascade");
  
      table
        .integer("question_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("questions")
        .onDelete("cascade");

      table
        .boolean("is_positive");

      table.timestamps();
    });
  }

  down () {
    this.drop("question_votes");
  }
}

module.exports = QuestionVoteSchema;
