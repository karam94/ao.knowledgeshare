"use strict";
const Question = use("App/Models/Question");

class QuestionRepository {
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
