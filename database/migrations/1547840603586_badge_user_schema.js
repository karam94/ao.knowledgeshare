"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BadgeUserSchema extends Schema {
  up () {
    this.create("badge_user", (table) => {
      table.increments();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("cascade");

      table
        .integer("badge_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("badges")
        .onDelete("cascade");
    });
  }

  down () {
    this.drop("badge_user");
  }
}

module.exports = BadgeUserSchema;
