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
      // location_id needs removing from here and then we have a joint user_location table joining user_id and location_id
      // shambles like this happens when can't hear myself think gg
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
