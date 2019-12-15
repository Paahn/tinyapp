const bcrypt = require('bcrypt');

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "user1RandomID",
    hits: 0,
    uniqueHits: 0,
    createDate: new Date()
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
    hits: 0,
    uniqueHits: 0,
    createDate: new Date()
  }
};

const users = {
  userData: {
    "user1RandomID": {
      id: "user1RandomID",
      email: "user@example.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
    },
    "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      password: bcrypt.hashSync("dishwasher-funk", 10)
    }
  }
}
const visits = {
  "b2xVn2": [
    { date: new Date(), visitorID: "ABCDEF" },
    { date: new Date(), visitorID: "XYZABC" },
    { date: new Date(), visitorID: "ABCDEF" }
  ]
};

module.exports = { urlDatabase, users, visits };