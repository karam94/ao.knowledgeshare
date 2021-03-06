"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table
        .string("username")
        .notNullable()
        .unique();
      table
        .string("email", 254)
        .notNullable()
        .unique();
      table
        .string("gravatar", 32)
        .notNullable()
        .unique();

      table.string("description", 160)
        .notNullable()
        .defaultTo("AO! Lets go!");

      table
        .integer("location_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("locations")
        .defaultTo(1)
        .onDelete("cascade");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
