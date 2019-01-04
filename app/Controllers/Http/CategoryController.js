"use strict";

const Post = use("App/Models/Post");
const Category = use("App/Models/Category");
const User = use("App/Models/User");
const Subscription = use("App/Models/Subscription");

class CategoryController {
  async index({ view, request, params, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const posts = await Post.query()
      .orderBy("id", "desc")
      .where("category_id", params.category_id)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .paginate(Number(request.input("page", 1)), 10);

    const category = await Category.query()
      .where("id", params.category_id)
      .firstOrFail();

    const userIsSubscribed = await Subscription.query()
      .where("user_id", user.id)
      .where("category_id", params.category_id)
      .first();

    return view.render("home", {
      posts: posts.toJSON(),
      category: category.toJSON(),
      userIsSubscribed: userIsSubscribed ? true : false,
      title: category.name
    });
  }

  async subscribe({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const existingSubscription = await Subscription.query()
      .where("user_id", user.id)
      .where("category_id", request.input("category_id"))
      .first();

    if (existingSubscription) {
      await Subscription.query()
        .where("user_id", user.id)
        .where("category_id", request.input("category_id"))
        .delete();

      session.flash({
        notification: {
          type: "danger",
          message: "You have been unsubscribed from this Category!"
        }
      });
    } else {
      const subscription = new Subscription();
      subscription.user_id = user.id;
      subscription.category_id = request.input("category_id");
      await user.subscriptions().save(subscription);

      session.flash({
        notification: {
          type: "success",
          message: "Category subscription added!"
        }
      });
    }

    var route = "/category/" + request.input("category_id");
    return response.route(route);
  }

  async subscriptions({ view, request, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const subscriptions = await Subscription.query()
      .where("user_id", user.id)
      .pluck("category_id");

    if (subscriptions.length > 0) {
      const posts = await Post.query()
        .orderBy("id", "desc")
        .whereIn("category_id", subscriptions)
        .with("category")
        .with("poster")
        .with("likes")
        .with("comments")
        .paginate(Number(request.input("page", 1)), 10);

      return view.render("home", {
        posts: posts.toJSON(),
        message: "Subscribed",
        title: "My Subscriptions"
      });
    } else {
      session.flash({
        notification: {
          type: "danger",
          message: "You are not subscribed to any categories!"
        }
      });

      return view.render("home", {
        title: "My Subscriptions"
      });
    }
  }
}

module.exports = CategoryController;
