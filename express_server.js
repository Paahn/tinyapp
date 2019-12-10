const express = require('express');
const app = express();
const PORT = 8080; // we're setting the default port at 8080

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/", (req, res) => {
  res.send("Hello, mortal.");
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

 app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase }; // IMPORTANT when we are sending a variable to and EJS template, we need
  res.render("urls_index", templateVars); // to enclose it in an object, even if we are sending only one variable.
 }); // (continued from comment above) this is so we can use the key of that object in our template

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});