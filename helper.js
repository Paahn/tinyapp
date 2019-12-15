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

module.exports = getUserByEmail;