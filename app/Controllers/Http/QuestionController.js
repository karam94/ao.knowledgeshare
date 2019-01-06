"use strict";

const Question = use("App/Models/Question");

class QuestionController {
  async details({ params, view, session }) {
    const question = await Question.query()
      .where("id", params.id)
      .with("category")
      .with("poster")
      .firstOrFail();

    return view.render("question/details", {
      question: question.toJSON()
    });
  }
}

module.exports = QuestionController;
