"use strict";

const Question = use("App/Models/Question");
const Category = use("App/Models/Category");
const User = use("App/Models/User");

class QuestionController {
  async create({ view }) {
    const categories = await Category.pair("id", "name");
    return view.render("question/create", { categories });
  }

  async add({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    var categoryId = request.input("category_id");

    if (categoryId === "0") {
      const category = new Category();
      category.name = request.input("new_category_name");
      await category.save();

      const question = new Question();
      question.category_id = category.id;
      question.title = request.input("title");
      question.description = request.input("description");

      await user.questions().save(question);
    } else {
      const question = new Question();
      question.category_id = categoryId;
      question.title = request.input("title");
      question.description = request.input("description");

      await user.questions().save(question);
    }

    session.flash({
      notification: {
        type: "success",
        message: "Question added!"
      }
    });

    return response.route("home");
  }

  async details({ params, view, session }) {
    const question = await Question.query()
      .where("id", params.id)
      .with("category")
      .with("poster")
      .with("answers.author")
      .firstOrFail();

    return view.render("question/details", {
      question: question.toJSON()
    });
  }
}

module.exports = QuestionController;
