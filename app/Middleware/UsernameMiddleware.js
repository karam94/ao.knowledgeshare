"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");

class UsernameMiddleware {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, session, view }, next) {
    const username = require("username");
    var thisUser = await username();
    var thisUserEmail = thisUser+"@ao.com";

    if (thisUser) {
      await User.findOrCreate(
        { username: thisUser, email:  thisUserEmail }
      );

      view.share({
        username: thisUser
      });

      session.put("username", thisUser);
    } else {
      return response.send(view.render("errors.401"));
    }

    await next();
  }
}

module.exports = UsernameMiddleware;
