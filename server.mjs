import 'dotenv/config'
import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users
import SuperLogger from './modules/SuperLogger.mjs';
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";
import DBManager from "./modules/storageManager.mjs";
import User from './modules/user.mjs';
import bcrypt from "bcrypt";

printDeveloperStartupInportantInformationMSG();

// Creating an instance of the server
const server = express();

// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);

// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

// Add basic authentication
//server.use(authentication);

// Defining a folder that will contain static files.
server.use(express.static('public'));

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);

// A get request handler example)
server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

// Start the server
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

// Authenticate user
async function authentication(req, res, next) {
  const authheader = req.headers.authorization;
  console.log(req.headers);

  if (!authheader) {
      let err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err)
  }
  // Get user name and password from header
  const auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':');
  const user = auth[0];
  const clearTextPassword = auth[1];

  // Check if user exists in DB
  console.log("Basic authentication: Looking up user " + user);
  let dbUser = new User();
  dbUser.id = user;
  dbUser = await DBManager.getUser(dbUser);

  if (dbUser.id != "" && dbUser.pswHash !="") {
    console.log("Basic authentication: Found valid user " + dbUser.id + " " + dbUser.pswHash);

    // Unhash password and check for match
    let isPasswordMatch = bcrypt.compareSync(clearTextPassword, dbUser.pswHash);
    console.log("Basic authentication: Password matches: " + isPasswordMatch);

    if (user == dbUser.id && isPasswordMatch) {
      console.log("Basic authentication: You have logged in successfully");
      // Set current user so we can get this from the client later
      //res.json({dbUser})
      res.cookie('SEMESTEROPPGAVE_CURRENT_USER', dbUser.id);
      next();
    }
    else {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
  }
  // Provide a hardcoded fallback user ;-)
  else if (user == '10000' && clearTextPassword == 'P@ssw0rd') {
    next();
  }
  else {
    let err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
};
