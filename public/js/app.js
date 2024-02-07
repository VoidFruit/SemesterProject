// Game functions

// Todo:

const currentLevel = 1;
let score = 0;
let currentState


// User functions

const output = document.getElementById('Output');

output.innerHTML = 'Some text to try out';

getUser(246810);

// Get all users
function getAllUsers() {

}

// Get user by id
function getUser(userId) {

  if (userId != '') {

    let requestUrl = 'http://localhost:8080/user/' + userId;

    fetch(requestUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok!');
      })
      .then(function (data) {
        // Process the response data here
        console.log('Processing data: ' + JSON.stringify(data));

        output.innerHTML = 'Id: ' + data.id + ', Name: ' + data.name + ', Email:' + data.email + ', Hiscore:' + data.hiscore;
      })
      .catch(function (error) {
        // Handle errors here
        console.log('An error occured!');
      });
  }
}

// Create user
function createUser(data) {

}

// Update user
function updateUser(data) {

}

// Delete user
function deleteUser(data) {

}

// Get hiscores
function getHiScores() {

}
