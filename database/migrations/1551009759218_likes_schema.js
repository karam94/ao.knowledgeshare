"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LikesSchema extends Schema {
  up () {    
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
        .references("id")
        .inTable("posts")
        .onDelete("cascade");

      table
        .integer("video_id")
        .unsigned()
        .references("id")
        .inTable("videos")
        .onDelete("cascade");

      table.timestamps();
    });
  }

  down () {
    this.drop("likes");
  }
}

module.exports = LikesSchema;
