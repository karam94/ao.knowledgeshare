"use strict";

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const User = use("App/Models/User");

class UserSeeder {
  async run() {
    const users = [
      {
        username: "TestUser",
        email: "test@test.com"
      },
      {
        username: "Karam",
        email: "karam.kabbara@ao.com"
      }
    ];

    await User.createMany(users);
  }
}

module.exports = UserSeeder;
