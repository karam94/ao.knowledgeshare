"use strict";

const User = use("App/Models/User");

class UserController {
  async index({ view, request, params, session }) {

    // becomes "is logged in user etc"
    const user = await User.query()
      .where("username", session.get("username"))
      .firstOrFail();
    
    const profileUser = await User.query()
      .where("username", params.username)
      .firstOrFail();

    return view.render("user/profile", {
      user: profileUser.toJSON(),
      title: params.username
    });
  }
}

module.exports = UserController;
