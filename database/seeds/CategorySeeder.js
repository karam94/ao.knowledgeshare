"use strict";

/*
|--------------------------------------------------------------------------
| CategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Category = use("App/Models/Category");

class CategorySeeder {
  async run() {
    const categories = [
      {
        name: "C#"
      },
      {
        name: "JavaScript"
      }
    ];

    await Category.createMany(categories);
  }
}

module.exports = CategorySeeder;
