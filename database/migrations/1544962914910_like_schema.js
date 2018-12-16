"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LikeSchema extends Schema {
  up() {
    this.create("likes", table => {
      table.increments();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("cascade");

      table
        .integer("post_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("posts")
        .onDelete("cascade");

      table.timestamps();
    });
  }

  down() {
    this.drop("likes");
  }
}

module.exports = LikeSchema;
