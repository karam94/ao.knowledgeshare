"use strict";
const Question = use("App/Models/Question");

class QuestionRepository {
  async create(userId, categoryId, title, description) {
    await Question.create({
      user_id: userId,
      category_id: categoryId,
      title: title,
      description: description
    });
  }

  async get(questionId){
    return await Question.query()
      .where("id", questionId)
      .first();
  }

  async getQuestionById(questionId, userId) {
    return await Question.query()
      .where("id", questionId)
      .with("category")
      .with("poster")
      .with("upvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", false);
      })
      .withCount("allupvotes", builder => {
        builder.where("is_positive", true);
      }) //rename this to make more flipping sense
      .withCount("alldownvotes", builder => {
        builder.where("is_positive", false);
      }) //rename this to make more flipping sense
      .with("answers.author")
      .with("answers.upvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", true);
      })
      .with("answers.downvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", false);
      })
      .with("answers", builder => {
        builder.orderBy("score", "desc");
      })
      .orderBy("score", "desc")
      .firstOrFail();
  }

  async getQuestions(userId, page, limit) {
    return await Question.query()
      .with("category")
      .with("poster")
      .with("upvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", false);
      })
      .with("answers.author")
      .orderBy("score", "desc")
      .paginate(page, limit);
  }

  async getQuestionsByCategoryPaginated(categoryId, userId, page, limit) {
    return await Question.query()
      .with("category")
      .where("category_id", categoryId)
      .with("poster")
      .with("upvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", false);
      })
      .with("answers.author")
      .orderBy("score", "desc")
      .paginate(page, limit);
  }

  async getQuestionsByCategoriesPaginated(subscriptions, userId, page, limit) {
    return await Question.query()
      .with("category")
      .whereIn("category_id", subscriptions)
      .with("poster")
      .with("upvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("user_id", userId);
        builder.where("is_positive", false);
      })
      .with("answers.author")
      .orderBy("score", "desc")
      .paginate(page, limit);
  }

  async getQuestionsForUserProfile(userId, limit) {
    return await Question.query()
      .where("user_id", userId)
      .with("category")
      .with("poster")
      .with("answers")
      .with("upvotes", builder => {
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("is_positive", false);
      })
      .orderBy("id", "desc")
      .limit(limit)
      .fetch();
  }
}

module.exports = new QuestionRepository();
