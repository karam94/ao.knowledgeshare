"use strict";

const User = use("App/Models/User");

class UserRepository {
  async get(username) {
    const user = await User.query()
      .where("username", username)
      .firstOrFail();

    return user;
  }
}

module.exports = UserRepository;
