// Game functions
//const currentLevel = 1;
//let score = 0;
//let currentState

// Test
// const output = document.getElementById('Output');
// output.innerHTML = 'Some text to try out';
//getUser(246810);



// Fill users table
const usersContainer = document.getElementById('usersContainer');
getUsers();


//---------------------------------------------------------------------------------------------------
// #region User functions
//---------------------------------------------------------------------------------------------------

// Get all users (Creates an HTML table with all users in the database)
function getUsers() {

  let requestUrl = 'http://localhost:8080/user/';

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
          let usersTable = document.createElement("table");
          usersTable.id = 'usersTable';

          // Create the table data
          for (let element of data) {
              let row = usersTable.insertRow();
              for (key in element) {
                  let cell = row.insertCell();
                  let text = document.createTextNode(element[key]);
                  cell.appendChild(text);
              }
          }

          // Create the table headings
          let thead = usersTable.createTHead();
          let row = thead.insertRow();
          for (let key of Object.keys(data[0])) {
              let th = document.createElement("th");
              let text = document.createTextNode(key);
              th.appendChild(text);
              row.appendChild(th);
          }
          usersContainer.appendChild(usersTable);
      })
      .catch(function (error) {
          // Handle errors here
          console.log('An error occured!');
      });
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

//#endregion
