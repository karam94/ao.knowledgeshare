"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use("Env");
const User = use("App/Models/User");
var md5 = require("md5");
var execa = require("execa");

class UsernameMiddleware {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, session, view }, next) {
    const username = require("username");
    var thisUser = await username();
    var thisUserEmail = "karam.kabbara@ao.com";

    // TODO: Test on AD at work
    if(Env.get("NODE_ENV") != "development"){
      try {
        thisUserEmail = execa.sync("whoami /upn").stdout;
      } catch(_){
        return response.send(view.render("errors.401"));
      }
    }

    if (thisUser) {
      var thisGravatar = md5(thisUserEmail);

      // TODO: Move this to a repository
      await User.findOrCreate(
        { username: thisUser, email: thisUserEmail, gravatar: thisGravatar }
      );

      view.share({
        username: thisUser,
        gravatar: thisGravatar
      });

      session.put("username", thisUser);
    } else {
      return response.send(view.render("errors.401"));
    }

    await next();
  }
}

module.exports = UsernameMiddleware;
