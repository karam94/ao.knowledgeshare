"use strict";
const User = use("App/Models/User");
const Location = use("App/Models/Location");

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

    // TODO: Fix this to have a user_location table and fetch based on relationship
    const location = await Location.find(profileUser.location_id);
    profileUser.location = location;
    return profileUser;
  }
}

module.exports = new UserRepository();
