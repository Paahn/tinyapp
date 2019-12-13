const express = require('express');
const app = express();
const PORT = 8080; // we're setting the default port at 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

const users = {
  "pkvyb": {
    id: "pkvyb",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "pikpa": {
    id: "pikpa",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}; 

// const emailSearcher = (req, res, users) => {
  
//   for (let value of Object.keys(users){
//     console.log(users["pikpa"]["email"]);
//     console.log(users[value]);
//     console.log(req.body.email);
//     if (req.body.email === users["pikpa"]["email"] || req.body.email === users["pkvyb"]["email"]){
//     return res.status(400).send("Error 400");
//     }
//   }
// }

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Function to generate a random string for new shortURLS
function generateRandomString() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}


app.get("/", (req, res) => {
  res.send("Hello, mortal.");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookies["username"] }); // See what I did there :smirk:
});

app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  }; // IMPORTANT when we are sending a variable to and EJS template, we need
  res.render("urls_index", templateVars); // to enclose it in an object, even if we are sending only one variable.
}); // (continued from comment above) this is so we can use the key of that object in our template

// this post will get the input from the /urls/new input form  
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    username: req.cookies,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  console.log(req.body);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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

app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = { longURL: [req.params.longURL] }
  res.redirect(`/urls/${newShortURL}`); // Redirect to the new shortURL page
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// app.get("/register", (req, res) => {
//   res.cookie("username", req.body.username);
//   res.render("urls_register");
// });

app.get("/register", (req, res) => {
  res.render("urls_register", { 
    username: req.cookies["username"] 
  });
});

app.post("/register", (req, res) => {
  const randomID = generateRandomString();
  users[randomID] = { 
    id: randomID,
    email: req.body.email,
    password: req.body.password 
  };

  if (req.body.password === "" || req.body.email === "") {
    res.status(400).send("Error 400");
  }
  for (let value of Object.keys(users)){
    console.log(users["pikpa"]["email"]);
    console.log(users[value]);
    console.log(req.body.email);
    if (req.body.email === users["pikpa"]["email"] || req.body.email === users["pkvyb"]["email"]){
    return res.status(400).send("Error 400");
    }
  };
  console.log(users);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.render("urls_login", { username: req.cookies["username"] });
});



app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});