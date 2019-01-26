"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up () {
    this.create("users", (table) => {
      table.increments();
      table.string("username").notNullable().unique();
      table.string("email", 254).notNullable().unique();
      table.string("gravatar", 32).notNullable().unique();
      table.text("description");
      table.timestamps();
    });
  }

  down () {
    this.drop("users");
  }
}

module.exports = UserSchema;
