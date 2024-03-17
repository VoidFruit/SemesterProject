import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import bcrypt from "bcrypt";
import DBManager from "../modules/storageManager.mjs";

const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];

// Get all users
USER_API.get('/', async (req, res, next) => {
 
    let users = await DBManager.getUsers();

    let usersArray = [];

    if (users != null) {
        users.forEach(element => {
            let user = new User();
            user.id = element.id;
            user.name = element.name;
            user.email = element.email;
            user.pswHash = element.password;
            user.isAdmin = element.isadmin;
            user.highscore = element.highscore;
            usersArray.push(user);
        });
     
        res.send(usersArray);
    }
    else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Det gikk dritt. Dårlig med brukere i basen.").end();
    }
})

// Get user
USER_API.get('/:id', async (req, res, next) => {

    const userId = req.params.id;

    if (userId != null) {
        let user = new User();
        user.id = userId;
        user = await user.get();

        // DBManager returns user object with empty id if no match was found
        if (user.id != "") {
            console.log("usersRoute Get user: " + user.id + " " + user.name);
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(user).end();
        }
        else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
            console.log("usersRoute Get user: No match!");
        }
    }
    else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("No user Id was provided!").end();
    }
})

// Create new user
USER_API.post('/', async (req, res, next) => {


    const { name, email, pswHash, isAdmin, highscore } = req.body;


    if (name != "" && email != "" && pswHash != "") {
        let user = new User();
        user.name = name;
        user.email = email;
        //Hash pw before saving
        const saltRounds = 10;
        const hash = bcrypt.hashSync(pswHash, saltRounds);
        user.pswHash = hash;
        user.isAdmin = isAdmin;
        user.highscore = highscore;

        let exists = false;

        console.log("User API: Create user: " + " Name: "+ name + " Password: " + pswHash + " Is admin?: " + isAdmin + " highscore: " + highscore);

        if (!exists) {
   
            user = await user.save();
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});


USER_API.put('/:id', async (req, res, next) => {

    const userId = req.params.id;
    const { name, email, pswHash, isAdmin, highscore } = req.body;

    if (userId != null) {

      // Check if user exist in db
      let user = new User();
      user.id = userId;
      user = await user.get();

      // DBManager returns user object with empty id if no match was found
      if (user.id != "") {
        console.log("usersRoute Update user: " + user.id + " " + user.name);

        user.name = name;
        user.email = email;
        // Has the password been updated?
        const bcryptHashRegex = /^\$2[ab]?\$\d{2}\$[A-Za-z0-9./]{53}$/;
        const isBcryptHash = bcryptHashRegex.test(pswHash);

        if (isBcryptHash) {
          console.log("usersRoute Update user: Password is already hashed - leaving it as is");
          user.pswHash = pswHash;
        }
        else {
          console.log("usersRoute Update user: Password seems to be updated - hash it before saving")
          const saltRounds = 10;
          const hash = bcrypt.hashSync(pswHash, saltRounds);
          user.pswHash = hash;
        }
        user.isAdmin = isAdmin;
        user.highscore = highscore;

        user = await user.save();
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
      }
      else {
          res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
          console.log("usersRoute Update user: No match!");
      }
    }
    else {
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }
});

// Delete existing user
USER_API.delete('/:id', async (req, res) => {

    let user = new User(); 

    const userId = req.params.id;
    if (userId != null) {
      user.id = userId;
      user = await user.get();

      // DBManager returns user object with empty id if no match was found
      if (user.id != "") {
        user.delete();
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
      }
      else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        console.log("usersRoute Delete user: No match!");
      }
    }
    else {
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }
});

USER_API.patch('/:id', async (req, res, next) => {

  const userId = req.params.id;
  const { highscore } = req.body;

  if (userId != null) {

    // Check if user exist in db
    let user = new User();
    user.id = userId;
    user = await user.get();

    // DBManager returns user object with empty id if no match was found
    if (user.id != "") {
      console.log("usersRoute Update highscore for user: " + user.id + " " + user.name + " to " + highscore);

      user.highscore = highscore;

      user = await user.saveHighscore();
      res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
    }
    else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        console.log("usersRoute Update user: No match!");
    }
  }
  else {
    res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
  }
});

// Login user
USER_API.post('/login/', async (req, res, next) => {

  const { email, pswHash } = req.body;

  if (email != "" && pswHash != "") {
      let user = new User();
      user.email = email;
      user.pswHash = pswHash;

      // Does the user exist, and does the password match?
      await user.authenticate();
      let isAuthenticated = false;
      // If the user was found in DB and password matched, the user will now have an id
      if (user.id !== undefined && user.id !== "") {
        isAuthenticated = true
      }
      if (isAuthenticated) {
          console.log(`usersRoute login: User ${user.id} ${user.email} is authenticated!`);
          //res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
          res.status(HTTPCodes.SuccesfullRespons.Ok).json(user).end();
      } else {
          res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
      }

  } else {
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing data").end();
  }
});

export default USER_API
