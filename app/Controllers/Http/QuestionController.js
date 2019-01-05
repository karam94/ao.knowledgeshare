"use strict";

const Question = use("App/Models/Question");

class QuestionController {
  async questions({ view, request, session }) {
    const questions = await Question.query()
      .orderBy("id", "desc")
      .with("category")
      .with("poster")
      .paginate(Number(request.input("page", 1)), 10);

    return view.render("questions", {
      questions: questions.toJSON()
    });
  }
}

module.exports = QuestionController;
