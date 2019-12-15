const express = require('express');
const PORT = 8080; // we're setting the default port at 8080
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const getUserByEmail = require('./helper');
// what bodyParser does is, it looks at the request body, and converts it into a 
// javascript object. So we can access the object properties by dot notation or [""]!!!!!
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["myKey"],
  maxAge: 60 * 60 * 1000 // 1 hour
}));

// Global variables

const urlDatabase = {
  urlData: {
    "b2xVn2": {
      url: "http://www.lighthouselabs.ca",
      userID: "user1RandomID"
    },
    "9sm5xK": {
      url: "http://www.google.com",
      userID: "user2RandomID"
    }
  }
}

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

};

// Helper functionsapp.set("view engine", "ejs");

// check if email already is registered under another user
const emailExists = (email, users) => {
  // console.log('email:', email);
  for (let userID in users) {
    // console.log('user:', userID);
    if (users[userID].email === email) {
      return true;
    }
  }
  return false;
};

// This function returns the user id that matches
// the given email and password
function findUser(email, password) {
  for (let userID in users) {
    if (users[userID].email === email
      && bcrypt.compareSync(password, users[user].password)) {
      return userID;
    }
  }
  return "";
}

const userUrlsFunc = (id) => {
  let myUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      myUrls[url] = urlDatabase[url];
    }
  }
  return myUrls;
}

// Function to generate a random string for new shortURLS or users
function generateRandomString() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}

// Get request responses

app.get("/", (req, res) => {
  res.send("Hello, mortal.");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let userID = req.cookies.user_id;
  let urls = userUrlsFunc(userID);
  if (!userID || !users[userID]) {
    res.redirect("/login");
  } else {
    let templateVars = {
      'user_id': req.cookies["user_id"],
      'user_email': req.cookies["user_email"],
      'urls': urls
    }; // IMPORTANT when we are sending a variable to and EJS template, we need
    res.render("urls_index", templateVars); // to enclose it in an object, even if we are sending only one variable.
  }; // (continued from comment above) this is so we can use the key of that object in our template
});
app.get("/urls/new", (req, res) => {
  let userID = req.cookies.user_id;
  if (!userID || !users[userID]) {
    res.redirect("/login");
  } else {
    let templateVars = {
      user_email: users[userID].email,
      user_id: userID
    }
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let userId = req.session.user_id;
  if (!userId || !users[userId]) {
    res.redirect("/login");
  } else if (!urlDatabase[shortUrl]) {
    res.send(404).send("Didn't find that one!");
  } else if (urlDatabase[shortUrl].userID !== userID) {
    res.sendStatus(403).send("Nope. Where are you going with this??");
  } else {
    let templateVars = {
      shortURL: shortURL,
      longURL: urlDatabase[shortURL].url,
      user_id: users[userId].email
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  const userUrls = userUrlsFunc(user, urlDatabase);
  let templateVars = { user };
  if (userURLs[req.params.shortURL]) {
    templateVars.shortURL = req.params.shortURL;
    templateVars.longURL = userURLs[req.params.shortURL].longURL;
    templateVars.hits = userURLs[req.params.shortURL].hits;
    templateVars.uniqueHits = userURLs[req.params.shortURL].uniqueHits;
    templateVars.createDate = userURLs[req.params.shortURL].createDate;
  } else {
    templateVars.longURL = null;
  }
  res.render("urls_show", templateVars);
});

// redirecting any request to shortURL to its longURL page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", { user: undefined });
  }
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("urls_login", { user: undefined });
  }
});

app.get("/logout", (req, res) => {
  req.session.user_id = undefined;
  res.redirect("/urls");
});

// Post requests responses


// app.post("/urls/:id", (req, res) => {
//   console.log(req.body);
//   urlDatabase[req.params.id] = req.body.longURL;
//   res.redirect('/urls');
// });

// this post will get the input from the /urls/new input form
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session.user_id;
  res.redirect(`/urls/${shortURL}`); // Redirect to the new shortURL page
});

app.post('/urls/:shortURL', (req, res) => {
  const user = users[req.session.user_id];
  const userURLs = userUrlsFunc(user, urlDatabase);
  if (userURLs[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect(`/urls/${req.params.shortURL}`);
  }
  res.status(400).send("Nope.");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session.user_id];
  const userUrls = userUrlsFunc(user, urlDatabase);
  if (userUrls[req.params.shortUrl]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
  res.status(400).send("Nope.");
});

app.post("/register", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    res.status(400).send("Missing email and password");
  } else if (emailExists(email, users)) {
    res.status(400).send('E-mail already in use');
  } else { // register a new user
    const randomID = generateRandomString();
    users[randomID] = {
      id: randomID,
      email: email,
      password: password
    };
    res.cookie("user_id", randomID);
    res.cookie("user_email", users[randomID].email);
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!password || !email) {
    res.status(400).send("Missing email and password");
  } else {
    const user = getUserByEmail(email, users);
    // console.log('inside login handler - user is:', user);
    if (user && user.password === password) {
      res.cookie('user_id', user.id);
      res.cookie('user_email', email);
      res.redirect('/urls');
    } else {
      res.status(401).send('Invalid credentials');
    }
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.clearCookie("user_email");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});