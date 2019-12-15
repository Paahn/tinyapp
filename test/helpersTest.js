const { assert } = require('chai');
const { emailTaken } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('emailTaken', () => {
  it('should return true if email corresponds to a user in the database', function() {
    const existingEmail = emailTaken("user@example.com", testUsers);
    const expectedOutput = true;
    assert.equal(existingEmail, expectedOutput);
  });

  it('should return undefined with an invalid email', () => {
    const nonExistantEmail = emailTaken("fake_email@test.com", testUsers);
    const expectedOutput = false;
    assert.equal(nonExistantEmail, expectedOutput);
  });
});