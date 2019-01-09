"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AnswerVoteSchema extends Schema {
  up () {
    this.create("answer_votes", (table) => {
      table.increments();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("cascade");

      table
        .integer("answer_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("answers")
        .onDelete("cascade");

      table
        .boolean("is_positive");

      table.timestamps();
    });
  }

  down () {
    this.drop("answer_votes");
  }
}

module.exports = AnswerVoteSchema;
