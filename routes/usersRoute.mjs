import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";


import DBManager from "../modules/storageManager.mjs";

const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];

USER_API.get('/', async (req, res, next) => {

    console.log("Get all users");    

    let users = await DBManager.getUsers();

    let usersArray = [];

    if (users != null) {
        users.forEach(element => {
            console.log("User name " + element.name);
            let user = new User();
            user.id = element.id;
            user.name = element.name;
            user.email = element.email;

            usersArray.push(user);

        });
        //res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(users)).end();
        //res.send(users);
        res.send(usersArray);
    }
    else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Det gikk dritt. Dårlig med brukere i basen.").end();
    }
})

USER_API.get('/:id', async (req, res, next) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object

    const userId = req.params.id;
    
    if (userId != null) {
        let user = new User();
        user.id = userId;
        user = await user.get();

        // DBManager returns user object with empty id if no match was found
        if (user.id != "") {
            console.log("usersRoute Get user: " + user.id + " " + user.name);
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
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

USER_API.post('/', async (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { name, email, password } = req.body;


    if (name != "" && email != "" && password != "") {
        let user = new User();
        user.name = name;
        user.email = email;

        ///TODO: Do not save passwords.
        user.pswHash = password;

        ///TODO: Does the user exist?
        let exists = false;

        if (!exists) {
            //TODO: What happens if this fails?
            user = await user.save();
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.post('/:id', (req, res, next) => {
    /// TODO: Edit user
    const user = new User(); //TODO: The user info comes as part of the request 
    user.save();
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
    const user = new User(); //TODO: Actual user
    user.delete();
});

export default USER_API
