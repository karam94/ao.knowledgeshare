"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");
var md5 = require("md5");

class UsernameMiddleware {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, session, view }, next) {
    const username = require("username");
    var thisUser = await username();
    // var thisUserEmail = thisUser+"@ao.com"; // TODO: Write plugin to fetch proper AD email
    var thisUserEmail = "karam.kabbara@ao.com";

    if (thisUser) {
      var thisGravatar = md5(thisUserEmail);

      await User.findOrCreate(
        { username: thisUser, email: thisUserEmail, gravatar: thisGravatar }
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
