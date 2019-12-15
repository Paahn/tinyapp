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

const userUrlsFunc = (id) => {
  let myUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      myUrls[url] = urlDatabase[url];
    }
  }
  return myUrls;
};

// Function to generate a random string for new shortURLS or users
function generateRandomString() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
};

module.exports = { getUserByEmail, userUrlsFunc, generateRandomString };