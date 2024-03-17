import { GameManager } from './game-manager.js';
import * as helpers from './helpers.js';

// Containers
const registerContainer = document.getElementById('registerContainer');
const loginContainer = document.getElementById('loginContainer');
const welcomeScene = document.getElementById('welcomeScene');
const countdownScene = document.getElementById('countdownScene');
const gameScene = document.getElementById('gameScene');
const gameOverScene = document.getElementById('gameOverScene');
const userFormContainer = document.getElementById('userFormContainer');
const usersContainer = document.getElementById('usersContainer');

// Text and action items
const loggedInUser = document.getElementById('loggedInUser');
const logoutLink = document.getElementById('logoutLink');
const adminLink = document.getElementById('adminLink');
const registerButton = document.getElementById("registerButton");
const toRegisterButton = document.getElementById("toRegisterButton");
const backToLoginButton = document.getElementById("backToLoginButton");
const loginButton = document.getElementById("loginButton");
const createUserButton = document.getElementById("createUserButton");

const gameManager = new GameManager();
let isAuthenticated = helpers.checkAuthentication();

if (isAuthenticated) {
  console.log("User is logged in. Starting.");
  if (loggedInUser) loggedInUser.classList.remove('hidden');
  if (logoutLink) logoutLink.classList.remove('hidden');

  // This needs to be done, only if you have isadmin=true
  const userIsAdmin = localStorage.getItem("isadmin");
  if (userIsAdmin == "true") {
    if (adminLink) adminLink.classList.remove('hidden');
  }
  gameManager.initGameStates();
}
else {
  if (loginContainer) loginContainer.classList.remove('hidden');
  if (welcomeScene) welcomeScene.classList.add('hidden');
}

// Handle user login
loginButton.onclick = async function (e) {
  const email = document.getElementById("loginEmail");
  const pswHash = document.getElementById("loginPsw");
  const validationMsg = document.getElementById("loginValidationMessage");
  const user = {email: email.value, pswHash: pswHash.value};
  if (email.value != "" && pswHash.value != "") {
    let response = await helpers.loginUser(user);
    console.log("Login button clicked " + response);
  }
  else {
    validationMsg.innerHTML = "Please provide valid email and password to log in"
  }
}

// Handle go to register new user
toRegisterButton.onclick = async function (e) {
  console.log('Entering register user screen');
  if (registerContainer) registerContainer.classList.remove('hidden');
  if (loginContainer) loginContainer.classList.add('hidden');
}

// Handle register new user
registerButton.onclick = async function (e) {
  const name = document.getElementById("registerName");
  const email = document.getElementById("registerEmail");
  const pswHash = document.getElementById("registerPsw");
  const pswHashRep = document.getElementById("registerPswRep");
  const validationMsg = document.getElementById("registerValidationMessage");
  const isAdmin = false;
  const highscore = 0; // Set initial score to zero when registering new user
  const user = { name: name.value, email: email.value, pswHash: pswHash.value, isAdmin, highscore };
  if (email.value != "" && pswHash.value != "" && pswHashRep.value != "") {
    let isValidEmail = helpers.validateEmail(email.value);
    if (isValidEmail) {
      if (pswHash.value === pswHashRep.value) {
        const respon = await helpers.createUser("/user", user);
        name.value = "";
        email.value = "";
        pswHash.value = "";
        pswHashRep.value = "";
        validationMsg.innerHTML = "User created. You can log in now!";
      }
      else {
        validationMsg.innerHTML = "Passwords do not match. Please retype your password.";
      }
    }
    else {
      validationMsg.innerHTML = "Not a valid e-mail address";
    }
  }
  else {
    validationMsg.innerHTML = "Looks like you're missing some information there pal. Please try again!"
  }
}

// Handle go back to login
backToLoginButton.onclick = async function (e) {
  console.log('Entering login screen');
  if (registerContainer) registerContainer.classList.add('hidden');
  if (loginContainer) loginContainer.classList.remove('hidden');
}

// Handle user logout
logoutLink.onclick = function (e) {
  e.preventDefault();
  helpers.logoutUser();
}

// Handle admin screen
adminLink.onclick = function (e) {
  e.preventDefault();
  console.log('Entering admin mode');
  if (registerContainer) registerContainer.classList.add('hidden');
  if (loginContainer) loginContainer.classList.add('hidden');
  if (welcomeScene) welcomeScene.classList.add('hidden');
  if (countdownScene) countdownScene.classList.add('hidden');
  if (gameScene) gameScene.classList.add('hidden');
  if (gameOverScene) gameOverScene.classList.add('hidden');
  if (userFormContainer) userFormContainer.classList.remove('hidden');
  if (usersContainer) usersContainer.classList.remove('hidden');
  helpers.getUsers();
}

// Handle admin create new user
// (Save and delete are wired up on getUsers)
createUserButton.onclick = async function (e) {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pswHash = document.getElementById("pswHash").value;
    const isAdminCheckBox = document.getElementById("isAdmin");
    const isAdmin = isAdminCheckBox.checked;
    const highscore = 0; // Set initial score to zero when creating new user
    const user = { name, email, pswHash, isAdmin, highscore };
    const respon = await helpers.createUser("/user", user);
    // Refresh the list again with recently added user
    await helpers.getUsers();
}


