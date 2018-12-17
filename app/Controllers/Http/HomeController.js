"use strict";

class HomeController {
  async index({ view }) {
    return view.render("home");
  }
}

module.exports = HomeController;
