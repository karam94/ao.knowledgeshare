"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BadgeSchema extends Schema {
  up () {
    this.create("badges", (table) => {
      table.increments();
      
      table
        .integer("category_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("categories")
        .onDelete("cascade");
      
      table.string("title");

      table.text("description");

      table.timestamps();
    });
  }

  down () {
    this.drop("badges");
  }
}

module.exports = BadgeSchema;
