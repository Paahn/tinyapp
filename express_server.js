const express = require('express');
const app = express();
const PORT = 8080; // we're setting the default port at 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Function to generate a random string for new shortURLS
function generateRandomString() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}


app.get("/", (req, res) => {
  res.send("Hello, mortal.");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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

 app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase }; // IMPORTANT when we are sending a variable to and EJS template, we need
  res.render("urls_index", templateVars); // to enclose it in an object, even if we are sending only one variable.
 }); // (continued from comment above) this is so we can use the key of that object in our template
 
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
  res.cookie("username", "whatever");
  res.redirect('/urls');
})

// app.get("/see-cookies", (req, res) => {
//   res.cookie("Panos", "SKJHDJSDUIAIUDHJADAJ")
//   res.send("hahahdhahdahahhdhahh");
// })


app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});