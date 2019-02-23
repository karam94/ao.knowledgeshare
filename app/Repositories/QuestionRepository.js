"use strict";
const Question = use("App/Models/Question");

class QuestionRepository {
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
