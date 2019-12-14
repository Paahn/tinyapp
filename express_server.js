const express = require('express');
const PORT = 8080; // we're setting the default port at 8080
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
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
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "user1RandomID"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "user2RandomID"
  }
}
console.log(urlDatabase)
const users = {
  "user1RandomID": {
    id: "user1RandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
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

const getUserByEmail = (email, users) => {
  // console.log('email:', email);
  for (let userID in users) {
    if (users[userID].email === email) {
      // console.log('userID:', userID);
      // console.log('user with that ID:', users[userID]);
      return users[userID];
    }
  }
  return null;
};

const userUrls = (id) => {
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
  let urls = userUrls(userID);
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
  let templateVars = {
    user_id: req.cookies,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>Boyos</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// redirecting any request to shortURL to its longURL page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  res.render("urls_register", {
    user_id: req.cookies["user_id"],
    user_email: req.cookies["email"]
  });
});

app.get("/login", (req, res) => {
  res.render("urls_login", { 'user_id': req.cookies["user_id"] });
});

// Post requests responses

// this post will get the input from the /urls/new input form  
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

app.post("/urls/:id", (req, res) => {
  console.log(req.body);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = { longURL: [req.params.longURL] }
  res.redirect(`/urls/${newShortURL}`); // Redirect to the new shortURL page
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
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