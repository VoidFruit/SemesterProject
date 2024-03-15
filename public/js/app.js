import { GameManager } from './game-manager.js'
  const gameManager = new GameManager();
  gameManager.initGameStates();

  const createUserButton = document.getElementById("createUserButton");
  createUserButton.onclick = async function (e) {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const pswHash = document.getElementById("pswHash").value;
      const isAdminCheckBox = document.getElementById("isAdmin");
      const isAdmin = isAdminCheckBox.checked;
      const highscore = 0; // Set initial score to zero when creating new user
      const user = { name, email, pswHash, isAdmin, highscore };
      const respon = await createUser("/user", user);
      // Refresh the list again with recently added user
      await getUsers();

  }

// The users table should be shown when entering admin mode
const usersContainer = document.getElementById('usersContainer');
getUsers();
// The highscores should be shown when displaying the game over screen
const highscoresContainer = document.getElementById('highscoresContainer');
getHighscores();
  // TODO move this to gameManager class
// Demo on how to update the highscore of a user - should be done on game over
async function updateHighScore(newscore, userId) {
  const highscore = newscore;
  const id = userId;
  const data = { highscore };

  try {
      await setUserHighscore(id, data); // Wait for highscore update
      await getUsers(); // Fetch users
      await getHighscores(); // Fetch highscores
  } catch (error) {
      console.error('Error updating highscore or fetching data:', error);
  }
}
updateHighScore(150, 82);

//---------------------------------------------------------------------------------------------------
// #region User functions
//---------------------------------------------------------------------------------------------------

// Get all users (Creates an HTML table with all users in the database)
async function getUsers() {

  const requestUrl = 'http://localhost:8080/user/';

  fetch(requestUrl)
      .then(function (response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error('Network response was not ok!');
      })
      .then(function (data) {
          // Process the response data here
          //console.log('Processing data: ' + JSON.stringify(data));

          // Remove table if it already exists
          const usersTableOld = document.getElementById('usersTable');
          if (usersTableOld != null) {
            usersTableOld.remove();
          }

          let usersTable = document.createElement("table");
          usersTable.id = 'usersTable';

          // Create the table data
          for (let element of data) {
              let row = usersTable.insertRow();
              for (key in element) {
                  //console.log("key is....." + key);
                  let cell = row.insertCell();

                  if (key == "id") {
                    let text = document.createTextNode(element[key]);
                    cell.appendChild(text);
                  }
                  else if (key == "name") {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.value = element[key];
                    input.id = element.id + "name";
                    cell.appendChild(input);
                  }
                  else if (key == "email") {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.value = element[key];
                    input.id = element.id + "email";
                    cell.appendChild(input);
                  }
                  else if (key == "pswHash") {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.value = element[key];
                    input.id = element.id + "pswHash";
                    cell.appendChild(input);
                  }
                  else if (key == "isAdmin") {
                    let input = document.createElement("input");
                    input.type = "checkbox";
                    input.id = element.id + "isAdmin";

                    if (element[key] == true) {
                      input.checked = true;
                    }
                    cell.appendChild(input);
                  }
                  else if (key == "highscore") {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.value = element[key];
                    input.id = element.id + "highscore";
                    input.readOnly = true;
                    cell.appendChild(input);
                  }
                  // Any other elements will be editable inputs
                  else {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.value = element[key];
                    cell.appendChild(input);
                  }
              }

              // Create a new cell for the button column
              let buttonCell = row.insertCell();

              // Add the save button
              let saveButton = document.createElement("button");
              saveButton.textContent = "Save";
              saveButton.className = "small-button";
              saveButton.id = "btnSaveUser-" + element.id;
              buttonCell.appendChild(saveButton);
              saveButton.addEventListener("click", function(){
                console.log("Save user: " + element.name);
                updateUser(element.id);
              });

              // Add the delete button
              let editButton = document.createElement("button");
              editButton.textContent = "Delete";
              editButton.className = "small-button ml-2";
              editButton.id = "btnDeleteUser-" + element.id;
              buttonCell.appendChild(editButton);
              editButton.addEventListener("click", function(){
                console.log("Delete user: " + element.name);
                deleteUser(element.id);
              });
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

          // Create extra heading cell for the button col
          let th = document.createElement("th");
          let text = document.createTextNode("Actions");
          th.appendChild(text);
          row.appendChild(th);

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
async function createUser(url, data) {
  const header = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  };

  const respon = await fetch(url, header);

  return respon;
}


// Update user
async function updateUser(userId) {

  const url = 'http://localhost:8080/user/' + userId;

  // Get the inputs from the users table
  const name = document.getElementById(userId + "name").value;
  const email = document.getElementById(userId + "email").value;
  const pswHash = document.getElementById(userId + "pswHash").value;
  const isAdminCheckBox = document.getElementById(userId + "isAdmin");
  const isAdmin = isAdminCheckBox.checked;
  const highscore = document.getElementById(userId + "highscore").value;
  const data = { userId, name, email, pswHash, isAdmin, highscore };

  fetch(url, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then((data) => {
      // Handle the successful response data
      console.log('Item updated successfully:', data);
  })
  .catch((error) => {
      // Handle any errors
      console.error('Error updating item:', error);
  });
}


// Delete user
async function deleteUser(userId) {
  console.log("Inside delete user function");
  const url = 'http://localhost:8080/user/' + userId;

  fetch(url, {
      method: 'DELETE', // Specify the HTTP method
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // You can also use response.json() if the server returns JSON
  })
  .then((data) => {
      // Handle the successful response data
      console.log('Item deleted successfully:', data);

      // Remove the deleted table row from the UI
      const btn = document.getElementById('btnDeleteUser-' + userId);
      if (btn != null) {
        const tableRow = btn.closest('tr');
        tableRow.remove();
      };
  })
  .catch((error) => {
      // Handle any errors
      console.error('Error deleting item:', error);
  });
}

async function getHighscores() {

  const requestUrl = 'http://localhost:8080/user/';

  fetch(requestUrl)
      .then(function (response) {
          if (response.ok) {
              return response.json();
          }
          throw new Error('Network response was not ok!');
      })
      .then(function (data) {
          // Process the response data here
          //console.log('Processing data: ' + JSON.stringify(data));

          // First, remove table if it already exists in the DOM
          const highscoreTableOld = document.getElementById('highscoresTable');
          if (highscoreTableOld != null) {
            highscoreTableOld.remove();
          }

          // Create the table element
          let highscoresTable = document.createElement("table");
          highscoresTable.id = 'highscoresTable';

          // Sort the array by highscores in descending order
          data.sort((a, b) => b.highscore - a.highscore);

          // Create the table cells
          for (let element of data) {
              let row = highscoresTable.insertRow();
              for (key in element) {
                  if (key == "name") {
                    let cell = row.insertCell();
                    let text = document.createTextNode(element[key]);
                    cell.appendChild(text);
                  }

                  if (key == "highscore") {
                    let cell = row.insertCell();
                    let text = document.createTextNode(element[key]);
                    cell.appendChild(text);
                  }
              }
          }

          // Create the table headings
          let thead = highscoresTable.createTHead();
          let row = thead.insertRow();
          for (let key of Object.keys(data[0])) {
            if (key == "name") {
              let th = document.createElement("th");
              let text = document.createTextNode(key);
              th.appendChild(text);
              row.appendChild(th);
            }
            if (key == "highscore") {
              let th = document.createElement("th");
              let text = document.createTextNode(key);
              th.appendChild(text);
              row.appendChild(th);
            }
          }
          // Insert the table in the DOM
          highscoresContainer.appendChild(highscoresTable);
      })
      .catch(function (error) {
          // Handle errors here
          console.log('An error occured!');
      });
}

// Set new highscore for user
async function setUserHighscore(userId, data) {
  const url = 'http://localhost:8080/user/' + userId;

  fetch(url, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then((data) => {
      // Handle the successful response data
      console.log('Item updated successfully:', data);
  })
  .catch((error) => {
      // Handle any errors
      console.error('Error updating item:', error);
  });
}

//#endregion
