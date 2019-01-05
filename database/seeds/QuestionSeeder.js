"use strict";

/*
|--------------------------------------------------------------------------
| QuestionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Question = use("App/Models/Question");

class QuestionSeeder {
  async run () {
    const questions = [
      {
        user_id: 1,
        category_id: 1,
        title: "This is a question?",
        description: "This is the description of my question! So I'll elaborate here... Does anybody have an answer? Thanks"
      }
    ];

    await Question.createMany(questions);
  }
}

module.exports = QuestionSeeder;
