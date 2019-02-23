"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class VideosSchema extends Schema {
  up () {
    this.create("videos", (table) => {
      table.increments();

      // Poster User Id
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("cascade");

      table
        .integer("category_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("categories")
        .onDelete("cascade");

      table.string("title");
      
      table.text("description");

      table.string("image");

      table.string("url").notNullable();

      table.timestamps();
    });
  }

  down () {
    this.drop("videos");
  }
}

module.exports = VideosSchema;
