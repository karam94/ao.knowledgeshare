"use strict";

const User = use("App/Models/User");

class UserRepository {
  async get(username) {
    const user = await User.query()
      .where("username", username)
      .firstOrFail();

    return user;
  }

  async getId(username) {
    const userId = await User.query()
      .where("username", username)
      .pluck("id");

    return userId;
  }

  async getProfileUser(username) {
    var profileUserId = await this.getId(username);

    const profileUser = await User.query()
      .where("username", username)
      .with("badges", builder => {
        builder.where("user_id", profileUserId);
      })
      .withCount("posts")
      .withCount("questions")
      .withCount("answers")
      .withCount("likes")
      .firstOrFail();

    return profileUser;
  }
}

module.exports = UserRepository;
