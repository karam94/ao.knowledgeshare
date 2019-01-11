"use strict";

const Question = use("App/Models/Question");
const QuestionVote = use("App/Models/QuestionVote");
const Category = use("App/Models/Category");
const User = use("App/Models/User");
const Answer = use("App/Models/Answer");

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
    const user = await User.query()
      .where("username", session.get("username"))
      .firstOrFail();

    const question = await Question.query()
      .where("id", params.id)
      .with("category")
      .with("poster")
      .with("upvotes", (builder) => {
        builder.where("user_id", user.id);
        builder.where("is_positive", true);
      })
      .with("downvotes", (builder) => {
        builder.where("user_id", user.id);
        builder.where("is_positive", false);
      })
      .withCount("allupvotes", (builder) => {
        builder.where("is_positive", true);
      }) //rename this to make more flipping sense
      .withCount("alldownvotes", (builder) => {
        builder.where("is_positive", false);
      }) //rename this to make more flipping sense
      .with("answers.author")
      .orderBy("score", "desc")
      .firstOrFail();

    var test = question.toJSON();
    return view.render("question/details", {
      question: question.toJSON()
    });
  }

  async answer({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const answer = new Answer();
    answer.user_id = user.id;
    answer.question_id = request.input("question_id");
    answer.answer = request.input("answer");
    await user.answers().save(answer);

    session.flash({
      notification: {
        type: "success",
        message: "Answer added!"
      }
    });

    var route = "/question/details/" + request.input("question_id");
    return response.route(route);
  }

  async upvote({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const question = await Question.query()
      .where("id", request.input("question_id"))
      .first();

    const vote = await QuestionVote.query()
      .where("user_id", user.id)
      .where("question_id", request.input("question_id"))
      .first();

    if(vote && vote.is_positive){
      vote.delete();
      
      question.score--;
      question.save(); 
    } else if (vote && !vote.is_positive){
      vote.is_positive = true;

      question.score++;
      question.score++; 
      question.save(); 

      await user.questionVotes().save(vote);
    } else {
      const newVote = new QuestionVote();
      newVote.user_id = user.id;
      newVote.question_id = request.input("question_id");
      newVote.is_positive = true;

      question.score++;
      question.save(); 
      
      await user.questionVotes().save(newVote);
    }

    return response.route("back");
  }

  async downvote({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const question = await Question.query()
      .where("id", request.input("question_id"))
      .first();

    const vote = await QuestionVote.query()
      .where("user_id", user.id)
      .where("question_id", request.input("question_id"))
      .first();

    if(vote && vote.is_positive){
      vote.is_positive = false;

      question.score--;
      question.score--;
      question.save(); 

      await user.questionVotes().save(vote);
    } else if (vote && !vote.is_positive){
      question.score++;
      question.save();

      vote.delete();
    } else {
      const newVote = new QuestionVote();
      newVote.user_id = user.id;
      newVote.question_id = request.input("question_id");
      newVote.is_positive = false;
      
      question.score--;
      question.save();

      await user.questionVotes().save(newVote);
    }

    return response.route("back");
  }
}

module.exports = QuestionController;
