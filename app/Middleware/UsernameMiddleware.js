"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class UsernameMiddleware {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, session, view }, next) {
    const username = require("username");
    var thisUser = await username();

    if (thisUser) {
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
