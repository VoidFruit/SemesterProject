// Get all users (Creates an HTML table with all users in the database)
export async function getUsers() {

  const requestUrl = '/user/';

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
              for (let key in element) {
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
                    input.type = "password";
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
export function getUser(userId) {

  if (userId != '') {

    let requestUrl = '/user/' + userId;

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

// Create user (admin)
export async function createUser(url, data) {
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

// Update user (admin)
export async function updateUser(userId) {

  const url = '/user/' + userId;

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

// Delete user (admin)
export async function deleteUser(userId) {
  console.log("Inside delete user function");
  const url = '/user/' + userId;

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

// Get hiscores
// Get all users (Creates an HTML table with all users in the database)
export async function getHighscores() {

  const requestUrl = '/user/';

  fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok!');
    })
    .then(function (data) {
      // Process the response data here
      const highscoresContainer = document.getElementById('highscoresContainer');

      console.log("Inside getHighScores " + data);

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
        console.log("Element " + element);
        let row = highscoresTable.insertRow();
        for (let key in element) {
          if (key == "name") {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          }
          if (key == "email") {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          }
          else if (key == "highscore") {
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
        if (key == "email") {
          let th = document.createElement("th");
          let text = document.createTextNode(key);
          th.appendChild(text);
          row.appendChild(th);
        }
        else if (key == "highscore") {
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
      console.log('An error occured! ' + error);
    });
}

// Set new highscore for user
export async function setUserHighscore(userId, data) {
  const url = '/user/' + userId;

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

// Register user
export async function registerUser(url, data) {
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

// Login
export async function loginUser(data) {
  const url = '/user/login';

  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log('Helpers: User logged in successfully:', response);
    return response.json();
  })
  .then((data) => {
    console.log('Helpers: User logged in successfully:', data);
    // Clear existing local storage entries
    localStorage.clear();

    // Add logged in user to local storage
    localStorage.setItem("id", data.id);
    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("highscore", data.highscore);
    localStorage.setItem("isadmin", data.isadmin);

    // Force a page reload so that local storage can be checked again
    window.location.reload();
    //window.location.reload(true);
  })
  .catch((error) => {
      // Handle any errors
      console.error('Error logging in user:', error);
  });
}

export function logoutUser() {
  localStorage.clear();
  window.location.reload();
}

// Read cookie value
export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split('; ');
  for (let i = 0; i < ca.length; i++) {
      const c = ca[i];
      if (c.indexOf(nameEQ) === 0) {
          const value = c.substring(nameEQ.length);
          return decodeURIComponent(value); // Returns the first found cookie
      }
  }
  return null; // Cookie not found
}

// Validate e-mail address
export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Check if user is already authenticated
export function checkAuthentication() {
  let isLoggedIn = false;
  let loggedInUserName = document.getElementById('loggedInUserName');
  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const userHighscore = localStorage.getItem("highscore");
  const userIsAdmin = localStorage.getItem("isadmin");

  if (userId != null) {
    isLoggedIn = true;
    loggedInUserName.innerHTML = userEmail;
  }
  console.log(`Check auth from local storage ${userId} ${userName} ${userEmail} ${userHighscore} ${userIsAdmin}`);
  return isLoggedIn;
}
