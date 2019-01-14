"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class QuestionSchema extends Schema {
  up () {
    this.create("questions", (table) => {
      table.increments();

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

      table.integer("score")
        .notNullable()
        .defaultTo(0);

      table.timestamps();
    });
  }

  down () {
    this.drop("questions");
  }
}

module.exports = QuestionSchema;
