"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

// Home
Route.get("/", "HomeController.index").as("home");

// Categories
Route.group(() => {
  Route.get("/:category_id", "CategoryController.index").as("posts");
  Route.post("/subscribe", "CategoryController.subscribe").as("subscribe");
}).prefix("/category");

// Subscriptions
Route.get("/subscriptions", "CategoryController.subscriptions").as("subscriptions");

// Posts
Route.group(() => {
  Route.get("/create", "PostController.create").as("post/create");
  Route.post("/add", "PostController.add").as("add");
  Route.get("/details/:id", "PostController.details").as("details");
  Route.post("/comment", "PostController.comment").as("comment");
  Route.post("/like", "PostController.like").as("like");
  Route.post("/delete", "PostController.delete").as("post/delete");
}).prefix("/post");

Route.group(() => {
  Route.get("/details/:id", "QuestionController.details").as("questionDetails");
}).prefix("/question");

// Comments
Route.group(() => {
  Route.post("/delete", "CommentController.delete").as("comment/delete");
}).prefix("/comment");