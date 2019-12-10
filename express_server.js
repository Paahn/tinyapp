const express = require('express');
const app = express();
const PORT = 8080; // we're setting the default port at 8080

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

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});