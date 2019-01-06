"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AnswersSchema extends Schema {
  up() {
    this.create("answers", table => {
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
        .string("answer")
        .notNullable()
        .unique();

      table.timestamps();
    });
  }

  down() {
    this.drop("answers");
  }
}

module.exports = AnswersSchema;
